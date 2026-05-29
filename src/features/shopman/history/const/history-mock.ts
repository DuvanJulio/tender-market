import type { THistoryData } from "../interfaces"

export const HISTORY_MOCK: THistoryData = {
  orders: [
    {
      id: "ORD-2024-1234",
      supplier: "Distribuidora El Sol",
      date: "14 de ene de 2024",
      status: "entregado",
      total: 185000,
      productCount: 5,
      products: [
        "Aceite Vegetal Premium 1L x12",
        "Arroz Premium Grano Largo 5kg x4",
        "+3 mas",
      ],
      note: "Entregado el 16 de ene de 2024",
    },
    {
      id: "ORD-2024-1237",
      supplier: "Lacteos Premium",
      date: "9 de ene de 2024",
      status: "cancelado",
      total: 45000,
      productCount: 2,
      products: ["Leche Entera UHT 1L x6 x4", "+1 mas"],
      note: "Pedido cancelado",
    },
  ],
}

export const HISTORY_FILTERS = ["Todos", "Entregado", "Cancelado"] as const
