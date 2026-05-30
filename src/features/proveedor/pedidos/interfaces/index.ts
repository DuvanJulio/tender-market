import type { TProveedorPedidoStatus } from "../const"

export type TProveedorPedidoProducto = {
  name: string
  quantity: number
  price: number
}

export type TProveedorPedido = {
  id: string
  customer: string
  customerPhone: string
  address: string
  items: number
  total: number
  status: TProveedorPedidoStatus
  occurred_at: string
  products: TProveedorPedidoProducto[]
}

export type IGetProveedorPedidosResponse = {
  success: boolean
  message: string
  data?: {
    pedidos: TProveedorPedido[]
    pendientes_count: number
  }
}

export type IPatchProveedorPedidoEstadoResponse = {
  success: boolean
  message: string
  data?: TProveedorPedido
}

export type TFetchProveedorPedidosParams = {
  search?: string
  estado?: TProveedorPedidoStatus | "all"
}
