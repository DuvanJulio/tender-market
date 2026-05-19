// /app/api/auth/sign-in/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. LOGIN
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // 2. VERIFICAR ESTADO
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('estados_usuarios (nombre), roles (nombre)')
      .eq('id', authData.user.id)
      .single()

    const estado = (usuario?.estados_usuarios as unknown as { nombre: string } | null)?.nombre
    const rol = (usuario?.roles as unknown as { nombre: string } | null)?.nombre

    if (estado === 'bloqueado') {
      await supabase.auth.signOut()
      return NextResponse.json(
        { success: false, message: 'Tu cuenta ha sido bloqueada. Contacta al administrador.' },
        { status: 403 }
      )
    }

    if (estado === 'inactivo') {
      await supabase.auth.signOut()
      return NextResponse.json(
        { success: false, message: 'Tu cuenta está inactiva.' },
        { status: 403 }
      )
    }

    // 3. ACTUALIZAR LAST_LOGIN
    await supabase
      .from('usuarios')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id)

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token: authData.session.access_token,
        rol
      }
    })

  } catch (error) {
    console.error('Error en sign-in:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}