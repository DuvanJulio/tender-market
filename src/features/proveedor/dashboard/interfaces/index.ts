export type TProveedorPedidoEstado =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type TProveedorDashboardKpis = {
  ventas_mes: number
  ventas_cambio_porcentaje: number | null
  pedidos_nuevos: number
  pedidos_nuevos_vs_ayer: number
  productos_activos: number
  productos_bajo_stock: number
  clientes_activos: number
  clientes_nuevos_mes: number
}

export type TProveedorPedidoReciente = {
  id: string
  customer: string
  items: number
  total: number
  status: TProveedorPedidoEstado
  occurred_at: string
}

export type TProveedorStockBajo = {
  id: number
  nombre: string
  stock: number
  min_stock: number
}

export type TProveedorTopProducto = {
  id: number
  nombre: string
  sales: number
  revenue: number
}

export type TProveedorDashboardData = {
  kpis: TProveedorDashboardKpis
  pedidos_recientes: TProveedorPedidoReciente[]
  stock_bajo: TProveedorStockBajo[]
  top_productos: TProveedorTopProducto[]
}

export type IGetProveedorDashboardResponse = {
  success: boolean
  message: string
  data?: TProveedorDashboardData
}
