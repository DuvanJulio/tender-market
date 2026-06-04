const CART_STORAGE_KEY = "shopman_cart"

import { createAppSlice } from "@/store/slice"
import type { TCartItem } from "@/features/shopman/cart/interfaces"

function persistCart(items: TCartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

type TShopmanCartState = {
  items: TCartItem[]
  hydrated: boolean
}

const initialState: TShopmanCartState = {
  items: [],
  hydrated: false,
}

const shopmanCartSlice = createAppSlice({
  name: "shopmanCart",
  initialState,
  reducers: (create) => ({
    hydrateCart: create.reducer((state) => {
      if (state.hydrated || typeof window === "undefined") return
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY)
        state.items = raw ? (JSON.parse(raw) as TCartItem[]) : []
      } catch {
        state.items = []
      }
      state.hydrated = true
    }),
    addCartItem: create.reducer(
      (state, action: { payload: Omit<TCartItem, "quantity"> & { quantity?: number } }) => {
        const { quantity = 1, ...product } = action.payload
        const existing = state.items.find(
          (item) => item.productoId === product.productoId
        )

        if (existing) {
          existing.quantity = Math.min(
            existing.stock,
            existing.quantity + quantity
          )
        } else {
          state.items.push({
            ...product,
            quantity: Math.min(product.stock, quantity),
          })
        }

        persistCart(state.items)
      }
    ),
    updateCartQuantity: create.reducer(
      (state, action: { payload: { productoId: number; quantity: number } }) => {
        state.items = state.items.map((item) => {
          if (item.productoId !== action.payload.productoId) return item
          const quantity = Math.max(
            1,
            Math.min(item.stock, action.payload.quantity)
          )
          return { ...item, quantity }
        })
        persistCart(state.items)
      }
    ),
    removeCartItem: create.reducer(
      (state, action: { payload: { productoId: number } }) => {
        state.items = state.items.filter(
          (item) => item.productoId !== action.payload.productoId
        )
        persistCart(state.items)
      }
    ),
    clearCart: create.reducer((state) => {
      state.items = []
      persistCart(state.items)
    }),
    repeatOrderInCart: create.reducer(
      (state, action: { payload: TCartItem[] }) => {
        for (const line of action.payload) {
          const existing = state.items.find(
            (item) => item.productoId === line.productoId
          )
          if (existing) {
            existing.quantity = Math.min(
              existing.stock,
              existing.quantity + line.quantity
            )
          } else {
            state.items.push(line)
          }
        }
        persistCart(state.items)
      }
    ),
  }),
  selectors: {
    selectShopmanCartItems: (state) => state.items,
    selectShopmanCartTotalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    selectShopmanCartSubtotal: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ),
    selectShopmanCartHydrated: (state) => state.hydrated,
  },
})

export const {
  hydrateCart,
  addCartItem,
  updateCartQuantity,
  removeCartItem,
  clearCart,
  repeatOrderInCart,
} = shopmanCartSlice.actions

export const {
  selectShopmanCartItems,
  selectShopmanCartTotalItems,
  selectShopmanCartSubtotal,
  selectShopmanCartHydrated,
} = shopmanCartSlice.selectors

export default shopmanCartSlice.reducer
