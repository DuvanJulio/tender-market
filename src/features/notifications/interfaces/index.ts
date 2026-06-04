export type TNotificacionTipo =
  | "pedido_nuevo"
  | "pedido_confirmado"
  | "pedido_enviado"
  | "pedido_entregado"
  | "pedido_cancelado"
  | "usuario_pendiente"
  | "producto_pendiente"

export type TNotificacion = {
  id: number
  tipo: TNotificacionTipo
  titulo: string
  mensaje: string
  pedido_codigo: string | null
  leida: boolean
  created_at: string
}

export type IGetNotificacionesResponse = {
  success: boolean
  message: string
  data?: {
    notificaciones: TNotificacion[]
    no_leidas: number
  }
}

export type IPatchNotificacionLeidaResponse = {
  success: boolean
  message: string
  data?: {
    no_leidas: number
  }
}

export type TNotificacionesScope = "tendero" | "proveedor" | "admin"
