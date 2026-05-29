export type TOrderStatus = "entregado" | "en-camino" | "procesando" | "cancelado"

export type TOrder = {
  id: string
  supplier: string
  date: string
  status: TOrderStatus
  total: number
  productCount: number
  products: string[]
  note: string
  canRepeat?: boolean
}

export type TOrdersData = {
  orders: TOrder[]
}

export type TOrdersFilter =
  | "Todos"
  | "Pendiente"
  | "Procesando"
  | "En camino"
