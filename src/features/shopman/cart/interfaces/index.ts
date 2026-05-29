export type TCartItem = {
  id: string
  name: string
  brand: string
  quantity: number
  unitPrice: number
  oldUnitPrice?: number
  unitLabel: string
}

export type TCartData = {
  items: TCartItem[]
  couponHint: string
}
