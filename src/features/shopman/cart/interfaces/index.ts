export type TCartItem = {
  productoId: number
  proveedorId: number
  id: string
  name: string
  brand: string
  quantity: number
  unitPrice: number
  stock: number
  imagen_url: string | null
}

export const SHOPMAN_CART_STORAGE_KEY = "shopman_cart"
