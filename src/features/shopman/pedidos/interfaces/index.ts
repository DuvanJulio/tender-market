export type TTenderoPedidoApiStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type TTenderoPedidoProductoApi = {
  producto_id?: number | null
  name: string
  quantity: number
  price: number
}

export type TTenderoPedidoApi = {
  id: string
  supplier: string
  supplierPhone: string
  address: string
  contact: string
  items: number
  total: number
  status: TTenderoPedidoApiStatus
  occurred_at: string
  products: TTenderoPedidoProductoApi[]
}

export type IGetTenderoPedidosResponse = {
  success: boolean
  message: string
  data?: {
    pedidos: TTenderoPedidoApi[]
    activos_count: number
  }
}

export type IPostTenderoPedidoBody = {
  items: { producto_id: number; quantity: number }[]
}

export type IPostTenderoPedidoResponse = {
  success: boolean
  message: string
  data?: {
    pedidos: TTenderoPedidoApi[]
  }
}

export type IPatchCancelarTenderoPedidoResponse = {
  success: boolean
  message: string
  data?: TTenderoPedidoApi
}

export type IGetTenderoCheckoutResponse = {
  success: boolean
  message: string
  data?: {
    direccion: string
    contacto: string
    telefono: string
    nombre_tienda: string
  }
}

export type TFetchTenderoPedidosParams = {
  search?: string
  estado?: TTenderoPedidoApiStatus
  historial?: boolean
}
