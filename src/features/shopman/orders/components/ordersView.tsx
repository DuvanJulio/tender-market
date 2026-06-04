"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  Package,
  RotateCcw,
  Search,
  Truck,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  cancelPedido,
  createPedido,
  fetchPedidos,
  resetCancelPedido,
  selectShopmanCancelPedido,
  selectShopmanCreatePedido,
  selectShopmanPedidosListView,
} from "@/store/shopman/pedidos-slice"
import { formatShopmanCurrency } from "../../const"
import { ORDER_STATUS_CONFIG, ORDERS_FILTERS } from "../const"
import type { TOrderStatus, TOrdersFilter } from "../interfaces"

const normalizeText = (value: string) => value.toLowerCase()

const filterMap: Record<TOrdersFilter, TOrderStatus[] | null> = {
  Todos: null,
  Pendiente: ["pendiente"],
  Procesando: ["procesando"],
  "En camino": ["en-camino"],
}

export function OrdersView() {
  const dispatch = useAppDispatch()
  const { status, message, orders, activosCount } = useAppSelector(
    selectShopmanPedidosListView
  )
  const cancelState = useAppSelector(selectShopmanCancelPedido)
  const createState = useAppSelector(selectShopmanCreatePedido)

  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<TOrdersFilter>("Todos")
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [repeatedOrders, setRepeatedOrders] = useState<string[]>([])

  const loadPedidos = useCallback(
    (search: string) => {
      dispatch(fetchPedidos({ search: search.trim() || undefined }))
    },
    [dispatch]
  )

  useEffect(() => {
    const timer = setTimeout(() => loadPedidos(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadPedidos])

  useEffect(() => {
    if (cancelState.status === "success" && cancelState.message) {
      toast.success(cancelState.message)
      dispatch(resetCancelPedido())
    }
    if (cancelState.status === "error" && cancelState.message) {
      toast.error(cancelState.message)
      dispatch(resetCancelPedido())
    }
  }, [cancelState.status, cancelState.message, dispatch])

  useEffect(() => {
    if (createState.status === "success" && createState.message) {
      toast.success(createState.message)
      loadPedidos(searchTerm)
    }
  }, [createState.status, createState.message, loadPedidos, searchTerm])

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

  const activeOrders = orders.filter(
    (order) =>
      order.status === "pendiente" ||
      order.status === "en-camino" ||
      order.status === "procesando"
  )

  const toggleExpanded = (id: string) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleRepeatOrder = (order: (typeof orders)[number]) => {
    const items = order.rawProducts
      .filter((product) => product.producto_id)
      .map((product) => ({
        producto_id: product.producto_id!,
        quantity: product.quantity,
      }))

    if (items.length === 0) {
      toast.error("No se pueden repetir los productos de este pedido")
      return
    }

    dispatch(createPedido({ items }))
    setRepeatedOrders((prev) => (prev.includes(order.id) ? prev : [...prev, order.id]))
  }

  const handleCancelOrder = (codigo: string) => {
    dispatch(cancelPedido(codigo))
  }

  const isLoading = status === "loading"
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

      {status === "error" && message ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message}
        </div>
      ) : null}

      <section className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Package className="h-4 w-4 text-primary" />
          Tienes {activosCount} pedido(s) activo(s)
        </div>
        {activeOrders.length > 0 ? (
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
        ) : null}
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

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {!hasResults ? (
              <div className="rounded-2xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                No hay pedidos activos que coincidan con los filtros.
              </div>
            ) : null}
            {visibleOrders.map((order) => {
              const config = ORDER_STATUS_CONFIG[order.status]
              const StatusIcon = config.icon
              const isExpanded = expandedOrders.includes(order.id)
              const isRepeated = repeatedOrders.includes(order.id)
              const isCancelling =
                cancelState.status === "loading" &&
                cancelState.pedidoId === order.id

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
                        {order.status === "pendiente" ? (
                          <Clock className="h-4 w-4" />
                        ) : order.status === "procesando" ? (
                          <Package className="h-4 w-4" />
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
                        {order.status === "pendiente" ? (
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={isCancelling}
                            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive disabled:opacity-50"
                          >
                            {isCancelling ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Cancelar
                          </button>
                        ) : null}
                        {order.canRepeat ? (
                          <button
                            type="button"
                            onClick={() => handleRepeatOrder(order)}
                            disabled={
                              isRepeated || createState.status === "loading"
                            }
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-primary-foreground ${
                              isRepeated ? "bg-emerald-600" : "bg-primary"
                            }`}
                          >
                            <RotateCcw className="h-4 w-4" />
                            {isRepeated ? "Pedido repetido" : "Repetir pedido"}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Dirección de entrega</span>
                          <span>{order.address ?? "—"}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Proveedor</span>
                          <span>{order.supplier}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Contacto proveedor</span>
                          <span>{order.supplierPhone ?? "—"}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span>Contacto</span>
                          <span>{order.contact ?? "—"}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
