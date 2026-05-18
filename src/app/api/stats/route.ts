import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Obtener el id del estado 'activo'
    const { data: estadoActivo } = await supabase
      .from('estados_usuarios')
      .select('id')
      .eq('nombre', 'activo')
      .single()

    const estadoId = estadoActivo?.id

    if (!estadoId) {
      return NextResponse.json(
        { success: false, message: 'No se encontró el estado activo' },
        { status: 500 }
      )
    }

    // Contar tenderos activos
    const { count: tenderos, error: errorTenderos } = await supabase
      .from('tenderos')
      .select('usuarios!inner(estado_id)', { count: 'exact', head: true })
      .eq('usuarios.estado_id', estadoId)

    // Contar proveedores activos
    const { count: proveedores, error: errorProveedores } = await supabase
      .from('proveedores')
      .select('usuarios!inner(estado_id)', { count: 'exact', head: true })
      .eq('usuarios.estado_id', estadoId)

    if (errorTenderos || errorProveedores) {
      return NextResponse.json(
        { success: false, message: 'Error al obtener estadísticas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: { 
        tenderos_activos: tenderos ?? 0,
        proveedores_activos: proveedores ?? 0
      }
    })

  } catch (error) {
    console.error('Error en stats API:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}