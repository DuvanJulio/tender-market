"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Package,
  Phone,
  Trash2,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  clearCart,
  hydrateCart,
  removeCartItem,
  selectShopmanCartHydrated,
  selectShopmanCartItems,
  selectShopmanCartSubtotal,
  selectShopmanCartTotalItems,
} from "@/store/shopman/cart-slice"
import {
  createPedido,
  fetchCheckout,
  resetCreatePedido,
  selectShopmanCheckoutView,
  selectShopmanCreatePedido,
} from "@/store/shopman/pedidos-slice"
import { formatShopmanCurrency } from "../../const"
import { CartItemQuantity } from "./cartItemQuantity"

export function CartView() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const items = useAppSelector(selectShopmanCartItems)
  const subtotal = useAppSelector(selectShopmanCartSubtotal)
  const totalItems = useAppSelector(selectShopmanCartTotalItems)
  const hydrated = useAppSelector(selectShopmanCartHydrated)
  const checkout = useAppSelector(selectShopmanCheckoutView)
  const createState = useAppSelector(selectShopmanCreatePedido)

  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    if (!hydrated) dispatch(hydrateCart())
  }, [hydrated, dispatch])

  useEffect(() => {
    if (createState.status === "success" && createState.message) {
      toast.success(createState.message)
      dispatch(clearCart())
      dispatch(resetCreatePedido())
      setShowCheckout(false)
      router.push("/shopman/orders")
    }
    if (createState.status === "error" && createState.message) {
      toast.error(createState.message)
      dispatch(resetCreatePedido())
    }
  }, [createState.status, createState.message, dispatch, router])

  const isEmpty = items.length === 0
  const isSubmitting = createState.status === "loading"

  const handleOpenCheckout = () => {
    dispatch(fetchCheckout())
    setShowCheckout(true)
  }

  const handleConfirmOrder = () => {
    dispatch(
      createPedido({
        items: items.map((item) => ({
          producto_id: item.productoId,
          quantity: item.quantity,
        })),
      })
    )
  }

  const checkoutContent = useMemo(() => {
    if (checkout.status === "loading") {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )
    }

    if (checkout.status === "error") {
      return (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {checkout.message}
        </p>
      )
    }

    if (!checkout.data) return null

    return (
      <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="font-medium text-foreground">Dirección de entrega</p>
            <p className="text-muted-foreground">{checkout.data.direccion}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <User className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="font-medium text-foreground">Contacto</p>
            <p className="text-muted-foreground">{checkout.data.contacto}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="font-medium text-foreground">Teléfono</p>
            <p className="text-muted-foreground">{checkout.data.telefono}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Si necesitas cambiar la dirección, contacta al administrador.
        </p>
      </div>
    )
  }, [checkout.data, checkout.message, checkout.status])

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Carrito de Compras
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalItems} unidades en tu carrito
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-4">
          {isEmpty ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-center text-sm text-muted-foreground">
              Tu carrito está vacío. Explora el catálogo para agregar productos.
            </div>
          ) : null}

          {items.map((item) => {
            const lineTotal = item.unitPrice * item.quantity

            return (
              <article
                key={item.productoId}
                className="rounded-2xl border border-border bg-background p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-muted/60">
                    {item.imagen_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imagen_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.name}
                    </h3>

                    <div className="mt-3 flex flex-col gap-1">
                      <CartItemQuantity
                        productoId={item.productoId}
                        quantity={item.quantity}
                        stock={item.stock}
                      />
                      {item.quantity >= item.stock ? (
                        <p className="text-[11px] text-amber-600">
                          Stock máximo: {item.stock}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <p className="text-base font-semibold text-primary">
                      {formatShopmanCurrency(lineTotal)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatShopmanCurrency(item.unitPrice)} c/u
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch(removeCartItem({ productoId: item.productoId }))
                    }
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
              Resumen del pedido
            </h2>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Subtotal ({totalItems} unidades)</span>
                <span className="font-semibold text-foreground">
                  {formatShopmanCurrency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Envío</span>
                <span className="font-semibold text-emerald-600">Gratis</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-semibold text-primary">
                {formatShopmanCurrency(subtotal)}
              </span>
            </div>

            <button
              type="button"
              disabled={isEmpty || isSubmitting}
              onClick={handleOpenCheckout}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Realizar pedido
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>

      {showCheckout ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              Confirmar pedido
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa la dirección de entrega antes de confirmar.
            </p>

            <div className="mt-4">{checkoutContent}</div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={
                  isSubmitting ||
                  checkout.status !== "success" ||
                  !checkout.data
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
