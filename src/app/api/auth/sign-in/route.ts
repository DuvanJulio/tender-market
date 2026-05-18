import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // =====================
    // VALIDACIONES
    // =====================
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // =====================
    // 1. LOGIN CON SUPABASE AUTH
    // =====================
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    const userId = authData.user.id

    // =====================
    // 2. TRAER PERFIL COMPLETO
    // =====================
    const { data: perfil, error: perfilError } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        apellido,
        avatar,
        roles (id, nombre),
        estados_usuarios (id, nombre)
      `)
      .eq('id', userId)
      .single()

    if (perfilError) {
      return NextResponse.json(
        { error: 'Error al obtener el perfil' },
        { status: 500 }
      )
    }

    // =====================
    // 3. VERIFICAR QUE EL USUARIO ESTÉ ACTIVO
    // =====================
    const estado = perfil.estados_usuarios as unknown as { nombre: string }
    if (estado.nombre === 'bloqueado') {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' },
        { status: 403 }
      )
    }

    if (estado.nombre === 'inactivo') {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'Tu cuenta está inactiva.' },
        { status: 403 }
      )
    }

    // =====================
    // 4. TRAER PERFIL ESPECÍFICO SEGÚN ROL
    // =====================
    const rol = (perfil.roles as unknown as { nombre: string }).nombre
    let perfilEspecifico = null

    if (rol === 'tendero') {
      const { data } = await supabase
        .from('tenderos')
        .select(`
          id,
          nombre_tienda,
          telefono,
          nit,
          direcciones (
            direccion,
            barrio,
            ciudades (id, nombre)
          )
        `)
        .eq('usuario_id', userId)
        .single()

      perfilEspecifico = data
    }

    if (rol === 'proveedor') {
      const { data } = await supabase
        .from('proveedores')
        .select(`
          id,
          nombre_empresa,
          nombre_contacto,
          telefono,
          nit,
          direcciones (
            direccion,
            barrio,
            ciudades (id, nombre)
          )
        `)
        .eq('usuario_id', userId)
        .single()

      perfilEspecifico = data
    }

    // =====================
    // 5. ACTUALIZAR LAST_LOGIN
    // =====================
    await supabase
      .from('usuarios')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)

    return NextResponse.json({
      mensaje: 'Login exitoso',
      token: authData.session.access_token,
      usuario: {
        id: userId,
        email: authData.user.email,
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        avatar: perfil.avatar,
        rol,
        estado: estado.nombre,
        perfil: perfilEspecifico
      }
    })

  } catch (error) {
    console.error('Error en sign-in:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}