"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Calendar,
  ChevronDown,
  Clock,
  Loader2,
  MapPin,
  Package,
  Phone,
  Search,
} from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchPedidos,
  resetUpdatePedidoEstado,
  selectProveedorPedidosListView,
  selectUpdateProveedorPedidoEstado,
  updatePedidoEstado,
} from "@/store/proveedor/pedidos-slice"
import { ProveedorPageHeader } from "../../components"
import { formatProveedorCurrency } from "../../const"
import {
  PROVEEDOR_PEDIDO_FILTER_OPTIONS,
  PROVEEDOR_PEDIDO_STATUS_CONFIG,
  type TProveedorPedidoStatus,
} from "../const"
import type { TFetchProveedorPedidosParams } from "../interfaces"

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "Hace un momento"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `Hace ${days} d`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ProveedorPedidosView() {
  const dispatch = useAppDispatch()
  const { status, message, pedidos, pendientesCount } = useAppSelector(
    selectProveedorPedidosListView
  )
  const updateState = useAppSelector(selectUpdateProveedorPedidoEstado)

  const [filter, setFilter] = useState<TProveedorPedidoStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const loadPedidos = useCallback(
    (params: TFetchProveedorPedidosParams) => {
      dispatch(fetchPedidos(params))
    },
    [dispatch]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPedidos({
        search: searchQuery.trim() || undefined,
        estado: filter,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [filter, searchQuery, loadPedidos])

  useEffect(() => {
    if (updateState.status === "success" && updateState.message) {
      toast.success(updateState.message)
      dispatch(resetUpdatePedidoEstado())
    }
    if (updateState.status === "error" && updateState.message) {
      toast.error(updateState.message)
      dispatch(resetUpdatePedidoEstado())
    }
  }, [updateState.status, updateState.message, dispatch])

  const handleStatusChange = (
    codigo: string,
    targetStatus: TProveedorPedidoStatus
  ) => {
    dispatch(updatePedidoEstado({ codigo, estado: targetStatus }))
  }

  const isLoading = status === "loading"
  const isUpdating = updateState.status === "loading"

  return (
    <div className="p-4 lg:p-6">
      <ProveedorPageHeader
        title="Pedidos"
        description="Gestiona los pedidos de tus clientes"
        actions={
          pendientesCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                {pendientesCount} pedido(s) pendiente(s)
              </span>
            </div>
          ) : undefined
        }
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por # de pedido o cliente..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {PROVEEDOR_PEDIDO_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {status === "error" && message ? (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((order) => {
            const statusConfig = PROVEEDOR_PEDIDO_STATUS_CONFIG[order.status]
            const StatusIcon = statusConfig.icon
            const isExpanded = selectedOrder === order.id
            const updatingThis =
              isUpdating && updateState.pedidoId === order.id

            return (
              <div
                key={order.id}
                className={`rounded-xl border bg-card transition-all ${
                  order.status === "pending"
                    ? "border-warning/30"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
                  onClick={() =>
                    setSelectedOrder(isExpanded ? null : order.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border ${statusConfig.color}`}
                    >
                      <StatusIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-card-foreground">
                          {order.id}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer} · {order.items} productos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {formatProveedorCurrency(order.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(order.occurred_at)}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isExpanded ? (
                  <div className="border-t border-border p-4">
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Información del Cliente
                        </h4>
                        <div className="space-y-2">
                          <p className="font-medium text-card-foreground">
                            {order.customer}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {order.customerPhone}
                          </div>
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                            {order.address}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.occurred_at)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Productos
                        </h4>
                        {order.products.length > 0 ? (
                          <div className="space-y-2">
                            {order.products.map((product, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg bg-muted p-2"
                              >
                                <div>
                                  <p className="text-sm font-medium text-card-foreground">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    x{product.quantity}
                                  </p>
                                </div>
                                <span className="text-sm font-medium text-card-foreground">
                                  {formatProveedorCurrency(
                                    product.price * product.quantity
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No hay detalles disponibles
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Acciones
                        </h4>
                        <div className="space-y-2">
                          {statusConfig.actions.map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              disabled={updatingThis}
                              onClick={() =>
                                handleStatusChange(
                                  order.id,
                                  action.targetStatus
                                )
                              }
                              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
                                action.label === "Rechazar"
                                  ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                              }`}
                            >
                              {updatingThis ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : null}
                              {action.label}
                            </button>
                          ))}
                          {statusConfig.actions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No hay acciones disponibles para este estado
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      {!isLoading && pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">
            No se encontraron pedidos
          </h2>
          <p className="mt-2 text-muted-foreground">
            {status === "error"
              ? "Revisa la conexión con el servidor o contacta al administrador"
              : "No hay pedidos que coincidan con los filtros seleccionados"}
          </p>
        </div>
      ) : null}
    </div>
  )
}
