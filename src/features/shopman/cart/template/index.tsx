"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronDown,
  History,
  LayoutGrid,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react"

type CartItem = {
  id: string
  name: string
  brand: string
  quantity: number
  unitPrice: number
  oldUnitPrice?: number
  unitLabel: string
}

type CartData = {
  items: CartItem[]
  couponHint: string
}

const CART_DATA: CartData = {
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

const COUPON_CODE = "TENDER20"
const COUPON_DISCOUNT = 0.2

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export const CarritoTemplate = () => {
  const [items, setItems] = useState<CartItem[]>(CART_DATA.items)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const couponHint = CART_DATA.couponHint

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
      ? Math.round(subtotal * COUPON_DISCOUNT)
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

    if (normalized === COUPON_CODE) {
      setCouponApplied(true)
      setCouponError(null)
      return
    }

    setCouponApplied(false)
    setCouponError("Codigo de cupon invalido")
  }
  const navItems = [
    {
      id: "catalog",
      label: "Catalogo",
      icon: LayoutGrid,
      href: "/shopman/catalog",
    },
    {
      id: "cart",
      label: "Carrito",
      icon: ShoppingCart,
      badge: items.length,
      href: "/shopman/cart",
      isActive: true,
    },
    {
      id: "orders",
      label: "Mis Pedidos",
      icon: Package,
      href: "/shopman/orders",
    },
    {
      id: "history",
      label: "Historial",
      icon: History,
      href: "/shopman/history",
    },
  ]

  const isEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">TenderMarket</span>
          </Link>

          <div className="flex flex-1 items-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar productos, marcas, categorias..."
                className="h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                2
              </span>
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                JP
              </span>
              <div className="hidden text-left text-xs sm:block">
                <p className="font-medium text-foreground">Juan Perez</p>
                <p className="text-muted-foreground">Tienda Don Pepe</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="border-t border-border bg-background">
          <nav className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const className = `relative flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors ${
                item.isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
              const content = (
                <>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-1 rounded-full bg-orange-500 px-2 text-[11px] font-semibold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={className}
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${className} cursor-not-allowed`}
                  aria-disabled
                >
                  {content}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
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
                        {formatCurrency(lineTotal)}
                      </p>
                      {lineOldTotal ? (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatCurrency(lineOldTotal)}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.unitPrice)} / {item.unitLabel}
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
              <h2 className="text-sm font-semibold text-foreground">Cupon de descuento</h2>
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
              <p className="mt-2 text-xs text-muted-foreground">{couponHint}</p>
              {couponApplied ? (
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  Cupon aplicado: {COUPON_CODE} (20%)
                </p>
              ) : null}
              {couponError ? (
                <p className="mt-2 text-xs font-semibold text-red-500">{couponError}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Resumen del pedido</h2>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600">Ahorro en productos</span>
                  <span className="font-semibold text-emerald-600">
                    -{formatCurrency(savings)}
                  </span>
                </div>
                {couponDiscount ? (
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Descuento cupon</span>
                    <span className="font-semibold text-emerald-600">
                      -{formatCurrency(couponDiscount)}
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
                  {formatCurrency(total)}
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
      </main>
    </div>
  )
}

export default CarritoTemplate
