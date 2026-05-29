import type { TCartData } from "../interfaces"

export const CART_MOCK: TCartData = {
  items: [
    {
      id: "aceite-vegetal-1l",
      name: "Aceite Vegetal Premium 1L",
      brand: "Oleica",
      quantity: 12,
      unitPrice: 8500,
      oldUnitPrice: 9500,
      unitLabel: "unidad",
    },
    {
      id: "arroz-grano-largo-5kg",
      name: "Arroz Premium Grano Largo 5kg",
      brand: "Arrocera Nacional",
      quantity: 8,
      unitPrice: 22000,
      unitLabel: "bulto",
    },
    {
      id: "detergente-liquido-3l",
      name: "Detergente Liquido 3L",
      brand: "LimpiMax",
      quantity: 6,
      unitPrice: 15000,
      oldUnitPrice: 18000,
      unitLabel: "galon",
    },
  ],
  couponHint: "Prueba: TENDER20 para 20% de descuento",
}

export const CART_COUPON_CODE = "TENDER20"
export const CART_COUPON_DISCOUNT = 0.2
