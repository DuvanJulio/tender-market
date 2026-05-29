import type { TOrdersData } from "../interfaces"

export const ORDERS_MOCK: TOrdersData = {
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
      canRepeat: true,
    },
    {
      id: "ORD-2024-1235",
      supplier: "Mayorista Central",
      date: "17 de ene de 2024",
      status: "en-camino",
      total: 92000,
      productCount: 3,
      products: [
        "Detergente Liquido 3L x6",
        "Jabon de Tocador Pack x12 x2",
        "+1 mas",
      ],
      note: "Entrega estimada: 19 de ene de 2024",
    },
    {
      id: "ORD-2024-1236",
      supplier: "Alimentos del Valle",
      date: "18 de ene de 2024",
      status: "procesando",
      total: 245000,
      productCount: 8,
      products: [
        "Cafe Molido Premium 500g x10",
        "Azucar Refinada 2.5kg x8",
        "+6 mas",
      ],
      note: "Entrega estimada: 21 de ene de 2024",
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

export const ORDERS_FILTERS = [
  "Todos",
  "Pendiente",
  "Procesando",
  "En camino",
] as const
