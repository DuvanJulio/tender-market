// /app/api/auth/sign-up/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      // Información Personal (todos los roles)
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol, // 'tendero' o 'proveedor'

      // Dirección (compartida)
      ciudad_id,
      direccion,
      barrio,

      // Datos de la tienda (tendero)
      nombre_tienda,
      nit_tienda,

      // Datos de la empresa (proveedor)
      nombre_empresa,
      nit_empresa,
      nombre_contacto,
    } = body

    // =====================
    // VALIDACIONES
    // =====================

    if (!nombre || !apellido || !email || !password || !telefono || !rol) {
      return NextResponse.json(
        { error: 'Nombre, apellido, email, teléfono, contraseña y rol son requeridos' },
        { status: 400 }
      )
    }

    if (!['tendero', 'proveedor'].includes(rol)) {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser tendero o proveedor' },
        { status: 400 }
      )
    }

    if (!ciudad_id || !direccion || !barrio) {
      return NextResponse.json(
        { error: 'Ciudad, dirección y barrio son requeridos' },
        { status: 400 }
      )
    }

    if (rol === 'tendero' && !nombre_tienda) {
      return NextResponse.json(
        { error: 'El nombre de la tienda es requerido' },
        { status: 400 }
      )
    }

    if (rol === 'proveedor' && (!nombre_empresa || !nombre_contacto)) {
      return NextResponse.json(
        { error: 'Nombre de empresa y nombre de contacto son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // =====================
    // 1. CREAR EN SUPABASE AUTH
    // =====================
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { rol }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este email ya está registrado' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    const userId = authData.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'Error al crear el usuario' },
        { status: 500 }
      )
    }

    // =====================
    // 2. COMPLETAR PERFIL EN TABLA USUARIOS
    // Solo datos personales, sin dirección
    // =====================
    const { error: perfilError } = await supabase
      .from('usuarios')
      .update({
        nombre,
        apellido,
      })
      .eq('id', userId)

    if (perfilError) {
      return NextResponse.json(
        { error: 'Error al guardar el perfil' },
        { status: 500 }
      )
    }

    // =====================
    // 3. CREAR DIRECCIÓN
    // =====================
    const { data: direccionData, error: direccionError } = await supabase
      .from('direcciones')
      .insert({
        ciudad_id,
        direccion,
        barrio
      })
      .select('id')
      .single()

    if (direccionError) {
      return NextResponse.json(
        { error: 'Error al guardar la dirección' },
        { status: 500 }
      )
    }

    // =====================
    // 4. CREAR PERFIL ESPECÍFICO CON direccion_id
    // =====================
    if (rol === 'tendero') {
      const { error: tenderoError } = await supabase
        .from('tenderos')
        .insert({
          usuario_id: userId,
          nombre_tienda,
          telefono,
          nit: nit_tienda || null,
          direccion_id: direccionData.id
        })

      if (tenderoError) {
        return NextResponse.json(
          { error: 'Error al crear perfil de tendero' },
          { status: 500 }
        )
      }
    }

    if (rol === 'proveedor') {
      const { error: proveedorError } = await supabase
        .from('proveedores')
        .insert({
          usuario_id: userId,
          nombre_empresa,
          nombre_contacto,
          telefono,
          nit: nit_empresa || null,
          direccion_id: direccionData.id
        })

      if (proveedorError) {
        return NextResponse.json(
          { error: 'Error al crear perfil de proveedor' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: userId,
        email,
        nombre,
        apellido,
        rol
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error en register:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}