"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Package,
  RotateCcw,
  Search,
  Truck,
  XCircle,
} from "lucide-react"
import { formatShopmanCurrency } from "../../const"
import { ORDER_STATUS_CONFIG, ORDERS_FILTERS, ORDERS_MOCK } from "../const"
import type { TOrderStatus, TOrdersFilter } from "../interfaces"

const normalizeText = (value: string) => value.toLowerCase()

const filterMap: Record<TOrdersFilter, TOrderStatus[] | null> = {
  Todos: null,
  Pendiente: ["procesando"],
  Procesando: ["procesando"],
  "En camino": ["en-camino"],
}

export function OrdersView() {
  const { orders } = ORDERS_MOCK
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<TOrdersFilter>("Todos")
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [repeatedOrders, setRepeatedOrders] = useState<string[]>([])

  const activeOrdersList = useMemo(
    () =>
      orders.filter(
        (order) => order.status !== "entregado" && order.status !== "cancelado"
      ),
    [orders]
  )

  const visibleOrders = useMemo(() => {
    const term = normalizeText(searchTerm.trim())
    const allowedStatuses = filterMap[activeFilter]

    return activeOrdersList.filter((order) => {
      const matchesFilter =
        !allowedStatuses || allowedStatuses.includes(order.status)
      const matchesSearch =
        !term ||
        normalizeText(order.id).includes(term) ||
        normalizeText(order.supplier).includes(term)

      return matchesFilter && matchesSearch
    })
  }, [activeOrdersList, searchTerm, activeFilter])

  const activeOrders = activeOrdersList.filter(
    (order) => order.status === "en-camino" || order.status === "procesando"
  )

  const toggleExpanded = (id: string) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleRepeatOrder = (id: string) => {
    setRepeatedOrders((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const hasResults = visibleOrders.length > 0

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Mis Pedidos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona y da seguimiento a tus pedidos
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Package className="h-4 w-4 text-primary" />
          Tienes {activeOrders.length} pedidos activos
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {activeOrders.map((order) => {
            const config = ORDER_STATUS_CONFIG[order.status]
            const StatusIcon = config.icon
            return (
              <span
                key={order.id}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                <StatusIcon className="h-3.5 w-3.5 text-primary" />
                {order.id}
                <span className="text-muted-foreground">•</span>
                {config.label}
              </span>
            )
          })}
        </div>
      </section>

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
            {ORDERS_FILTERS.map((filter) => (
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
              No hay pedidos que coincidan con los filtros actuales.
            </div>
          ) : null}
          {visibleOrders.map((order) => {
            const config = ORDER_STATUS_CONFIG[order.status]
            const StatusIcon = config.icon
            const isExpanded = expandedOrders.includes(order.id)
            const isRepeated = repeatedOrders.includes(order.id)

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
                        {formatShopmanCurrency(order.total)}
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
                      {order.status === "procesando" ? (
                        <Clock className="h-4 w-4" />
                      ) : order.status === "en-camino" ? (
                        <Truck className="h-4 w-4" />
                      ) : order.status === "entregado" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>{order.note}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(order.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground"
                      >
                        <Eye className="h-4 w-4" />
                        {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                      </button>
                      {order.canRepeat ? (
                        <button
                          type="button"
                          onClick={() => handleRepeatOrder(order.id)}
                          disabled={isRepeated}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-primary-foreground ${
                            isRepeated ? "bg-emerald-600" : "bg-primary"
                          }`}
                        >
                          <RotateCcw className="h-4 w-4" />
                          {isRepeated ? "Pedido agregado" : "Repetir pedido"}
                        </button>
                      ) : null}
                    </div>
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
    </>
  )
}
