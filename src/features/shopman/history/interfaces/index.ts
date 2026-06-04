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
  address?: string
  contact?: string
  rawProducts?: {
    producto_id?: number | null
    name: string
    quantity: number
    price: number
  }[]
}

export type THistoryData = {
  orders: THistoryOrder[]
}

export type THistoryFilter = "Todos" | "Entregado" | "Cancelado"
