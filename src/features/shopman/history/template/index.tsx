"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  History,
  LayoutGrid,
  Package,
  Search,
  ShoppingCart,
  Store,
  XCircle,
} from "lucide-react"

type HistoryStatus = "entregado" | "cancelado"

type HistoryOrder = {
  id: string
  supplier: string
  date: string
  status: HistoryStatus
  total: number
  productCount: number
  products: string[]
  note: string
}

type HistoryData = {
  orders: HistoryOrder[]
}

type HistoryFilter = "Todos" | "Entregado" | "Cancelado"

const HISTORY_DATA: HistoryData = {
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

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

const normalizeText = (value: string) => value.toLowerCase()

const statusStyles = {
  entregado: {
    label: "Entregado",
    badge: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    iconWrap: "bg-emerald-100 text-emerald-600",
    note: "text-emerald-600",
  },
  cancelado: {
    label: "Cancelado",
    badge: "bg-red-100 text-red-700",
    icon: XCircle,
    iconWrap: "bg-red-100 text-red-600",
    note: "text-red-600",
  },
}

export const HistoryTemplate = () => {
  const { orders } = HISTORY_DATA
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>("Todos")
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  const filterMap: Record<HistoryFilter, HistoryStatus[] | null> = {
    Todos: null,
    Entregado: ["entregado"],
    Cancelado: ["cancelado"],
  }

  const visibleOrders = useMemo(() => {
    const term = normalizeText(searchTerm.trim())
    const allowedStatuses = filterMap[activeFilter]

    return orders.filter((order) => {
      const matchesFilter =
        !allowedStatuses || allowedStatuses.includes(order.status)
      const matchesSearch =
        !term ||
        normalizeText(order.id).includes(term) ||
        normalizeText(order.supplier).includes(term)

      return matchesFilter && matchesSearch
    })
  }, [orders, searchTerm, activeFilter])

  const toggleExpanded = (id: string) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
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
      badge: 3,
      href: "/shopman/cart",
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
      isActive: true,
    },
  ]
  const filters: HistoryFilter[] = ["Todos", "Entregado", "Cancelado"]
  const hasResults = visibleOrders.length > 0

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
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Historial de Pedidos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta tus pedidos entregados o cancelados
          </p>
        </div>

        <section className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por # de pedido..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                    filter === activeFilter
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={filter === activeFilter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {!hasResults ? (
              <div className="rounded-2xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                No hay pedidos en el historial.
              </div>
            ) : null}
            {visibleOrders.map((order) => {
              const config = statusStyles[order.status]
              const StatusIcon = config.icon
              const isExpanded = expandedOrders.includes(order.id)

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconWrap}`}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {order.id}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.supplier} • {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.productCount} productos
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(order.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground"
                        aria-label="Ver orden"
                        aria-pressed={isExpanded}
                      >
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      PRODUCTOS
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {order.products.map((product) => (
                        <span
                          key={product}
                          className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                        >
                          {product}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div
                        className={`flex items-center gap-2 text-xs ${config.note}`}
                      >
                        {order.status === "entregado" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span>{order.note}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpanded(order.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground"
                      >
                        {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Direccion de entrega</span>
                          <span>Calle 123 #45-67</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Metodo de entrega</span>
                          <span>Envio estandar</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Contacto</span>
                          <span>Juan Perez</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default HistoryTemplate
