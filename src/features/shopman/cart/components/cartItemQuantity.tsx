"use client"

import { useEffect, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useAppDispatch } from "@/store"
import { updateCartQuantity } from "@/store/shopman/cart-slice"

type CartItemQuantityProps = {
  productoId: number
  quantity: number
  stock: number
}

function clampQuantity(value: number, stock: number) {
  return Math.min(stock, Math.max(1, value))
}

export function CartItemQuantity({
  productoId,
  quantity,
  stock,
}: CartItemQuantityProps) {
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState(String(quantity))

  useEffect(() => {
    setDraft(String(quantity))
  }, [quantity])

  const applyQuantity = (next: number) => {
    const clamped = clampQuantity(next, stock)
    dispatch(updateCartQuantity({ productoId, quantity: clamped }))
    setDraft(String(clamped))
  }

  const commitDraft = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      applyQuantity(1)
      return
    }

    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed)) {
      applyQuantity(quantity)
      return
    }

    applyQuantity(parsed)
  }

  const handleDecrease = () => applyQuantity(quantity - 1)
  const handleIncrease = () => applyQuantity(quantity + 1)

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-background p-1">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(event) => {
          const value = event.target.value.replace(/\D/g, "")
          setDraft(value)
        }}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur()
          }
        }}
        aria-label="Cantidad"
        className="h-8 w-12 rounded-md border-0 bg-transparent text-center text-sm font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= stock}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
