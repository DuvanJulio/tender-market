export type THistoryStatus = "entregado" | "cancelado"

export type THistoryOrder = {
  id: string
  supplier: string
  date: string
  status: THistoryStatus
  total: number
  productCount: number
  products: string[]
  note: string
}

export type THistoryData = {
  orders: THistoryOrder[]
}

export type THistoryFilter = "Todos" | "Entregado" | "Cancelado"
