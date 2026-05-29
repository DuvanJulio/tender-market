"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, ChevronRight, Search, XCircle } from "lucide-react"
import { formatShopmanCurrency } from "../../const"
import {
  HISTORY_FILTERS,
  HISTORY_MOCK,
  HISTORY_STATUS_CONFIG,
} from "../const"
import type { THistoryFilter, THistoryStatus } from "../interfaces"

const normalizeText = (value: string) => value.toLowerCase()

const filterMap: Record<THistoryFilter, THistoryStatus[] | null> = {
  Todos: null,
  Entregado: ["entregado"],
  Cancelado: ["cancelado"],
}

export function HistoryView() {
  const { orders } = HISTORY_MOCK
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<THistoryFilter>("Todos")
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

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

  const hasResults = visibleOrders.length > 0

  return (
    <>
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
            {HISTORY_FILTERS.map((filter) => (
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
            const config = HISTORY_STATUS_CONFIG[order.status]
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
    </>
  )
}
