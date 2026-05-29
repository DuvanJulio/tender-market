"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import { formatShopmanCurrency } from "../../const"
import { useShopmanCartBadge } from "../../components/shopmanLayout"
import {
  CART_COUPON_CODE,
  CART_COUPON_DISCOUNT,
  CART_MOCK,
} from "../const"
import type { TCartItem } from "../interfaces"

export function CartView() {
  const [items, setItems] = useState<TCartItem[]>(CART_MOCK.items)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  useShopmanCartBadge(items.length)

  const { totalItems, subtotal, savings, couponDiscount, total } = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    )
    const oldTotal = items.reduce(
      (acc, item) => acc + item.quantity * (item.oldUnitPrice ?? item.unitPrice),
      0
    )
    const savings = Math.max(0, oldTotal - subtotal)
    const couponDiscount = couponApplied
      ? Math.round(subtotal * CART_COUPON_DISCOUNT)
      : 0
    const total = Math.max(0, subtotal - couponDiscount)

    return { totalItems, subtotal, savings, couponDiscount, total }
  }, [items, couponApplied])

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const nextQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: nextQuantity }
      })
    )
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleApplyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase()
    if (!normalized) return

    if (normalized === CART_COUPON_CODE) {
      setCouponApplied(true)
      setCouponError(null)
      return
    }

    setCouponApplied(false)
    setCouponError("Codigo de cupon invalido")
  }

  const isEmpty = items.length === 0

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Carrito de Compras
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} productos en tu carrito
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-4">
          {items.map((item) => {
            const lineTotal = item.unitPrice * item.quantity
            const lineOldTotal = item.oldUnitPrice
              ? item.oldUnitPrice * item.quantity
              : null
            const isMinQuantity = item.quantity <= 1

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-background p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted/60">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        disabled={isMinQuantity}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Disminuir"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <p className="text-base font-semibold text-primary">
                      {formatShopmanCurrency(lineTotal)}
                    </p>
                    {lineOldTotal ? (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatShopmanCurrency(lineOldTotal)}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {formatShopmanCurrency(item.unitPrice)} / {item.unitLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            )
          })}

          <Link
            href="/shopman/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">
              Cupon de descuento
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Codigo de cupon"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim()}
                className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Aplicar
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {CART_MOCK.couponHint}
            </p>
            {couponApplied ? (
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                Cupon aplicado: {CART_COUPON_CODE} (20%)
              </p>
            ) : null}
            {couponError ? (
              <p className="mt-2 text-xs font-semibold text-red-500">
                {couponError}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">
              Resumen del pedido
            </h2>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-foreground">
                  {formatShopmanCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600">Ahorro en productos</span>
                <span className="font-semibold text-emerald-600">
                  -{formatShopmanCurrency(savings)}
                </span>
              </div>
              {couponDiscount ? (
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600">Descuento cupon</span>
                  <span className="font-semibold text-emerald-600">
                    -{formatShopmanCurrency(couponDiscount)}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span>Envio</span>
                <span className="font-semibold text-emerald-600">Gratis</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-semibold text-primary">
                {formatShopmanCurrency(total)}
              </span>
            </div>

            <button
              type="button"
              disabled={isEmpty}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Realizar pedido
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
