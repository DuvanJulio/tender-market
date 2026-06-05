"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Loader2,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchProveedorDashboard,
  selectProveedorDashboardView,
} from "@/store/proveedor/dashboard-slice"
import { formatProveedorCurrency } from "../../const"
import { PROVEEDOR_ORDER_STATUS_CONFIG } from "../const"

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("es-CO", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 10_000 ? 1 : 0,
  }).format(value)
}

function formatPercentChange(value: number | null) {
  if (value === null) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${value}%`
}

function formatPedidosVsAyer(diff: number) {
  if (diff === 0) return "Igual que ayer"
  const sign = diff > 0 ? "+" : ""
  return `${sign}${diff} vs ayer`
}

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

export function ProveedorDashboardView() {
  const dispatch = useAppDispatch()
  const { status, message, data } = useAppSelector(selectProveedorDashboardView)

  useEffect(() => {
    dispatch(fetchProveedorDashboard())
  }, [dispatch])

  const statCards = useMemo(() => {
    if (!data) return []

    const { kpis } = data
    const ventasTrend =
      kpis.ventas_cambio_porcentaje !== null ? "up" : ("neutral" as const)
    const pedidosTrend = kpis.pedidos_nuevos_vs_ayer >= 0 ? "up" : "down"

    return [
      {
        title: "Ventas del Mes",
        value: formatProveedorCurrency(kpis.ventas_mes),
        change: formatPercentChange(kpis.ventas_cambio_porcentaje),
        trend: ventasTrend,
        icon: DollarSign,
        iconClassName: "bg-primary/10 text-primary",
      },
      {
        title: "Pedidos Nuevos",
        value: formatCompactNumber(kpis.pedidos_nuevos),
        change: formatPedidosVsAyer(kpis.pedidos_nuevos_vs_ayer),
        trend: pedidosTrend,
        icon: ShoppingCart,
        iconClassName: "bg-accent/10 text-accent",
      },
      {
        title: "Productos Activos",
        value: formatCompactNumber(kpis.productos_activos),
        change:
          kpis.productos_bajo_stock > 0
            ? `${kpis.productos_bajo_stock} con bajo stock`
            : "Inventario al día",
        trend: kpis.productos_bajo_stock > 0 ? "warning" : "up",
        icon: Package,
        iconClassName: "bg-success/10 text-success",
      },
      {
        title: "Clientes Activos",
        value: formatCompactNumber(kpis.clientes_activos),
        change:
          kpis.clientes_nuevos_mes > 0
            ? `+${kpis.clientes_nuevos_mes} nuevos`
            : "Sin nuevos este mes",
        trend: kpis.clientes_nuevos_mes > 0 ? "up" : "neutral",
        icon: Users,
        iconClassName: "bg-primary/10 text-primary",
      },
    ] as const
  }, [data])

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-[320px] items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "error" || !data) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        {message ?? "No se pudo cargar el dashboard."}
      </div>
    )
  }

  const { pedidos_recientes, stock_bajo, top_productos } = data

  return (
    <div className="p-4 lg:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconClassName}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.trend === "up" ? (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              ) : null}
              {stat.trend === "down" ? (
                <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  {stat.change}
                </span>
              ) : null}
              {stat.trend === "warning" ? (
                <span className="flex items-center gap-1 text-xs font-medium text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  {stat.change}
                </span>
              ) : null}
              {stat.trend === "neutral" ? (
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.change}
                </span>
              ) : null}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-card-foreground">
              Pedidos Recientes
            </h2>
            <Link
              href="/proveedor/pedidos"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              Ver todos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pedidos_recientes.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Aún no hay pedidos registrados.
              </p>
            ) : (
              pedidos_recientes.map((order) => {
                const statusConfig = PROVEEDOR_ORDER_STATUS_CONFIG[order.status]
                const StatusIcon = statusConfig.icon
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${statusConfig.color}`}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-card-foreground">
                            {order.id}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customer} · {order.items} productos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-card-foreground">
                        {formatProveedorCurrency(order.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(order.occurred_at)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-warning/30 bg-warning/5">
            <div className="flex items-center gap-2 border-b border-warning/20 p-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="font-semibold text-card-foreground">Stock Bajo</h2>
            </div>
            <div className="divide-y divide-warning/20">
              {stock_bajo.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  No hay productos con stock bajo.
                </p>
              ) : (
                stock_bajo.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {product.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mín: {product.min_stock} unidades
                      </p>
                    </div>
                    <span className="rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-warning">
                      {product.stock} uds
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4">
              <Link
                href="/proveedor/productos"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-warning/30 py-2 text-sm font-medium text-warning transition-colors hover:bg-warning/10"
              >
                Gestionar inventario
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-semibold text-card-foreground">
                Top Productos
              </h2>
              <span className="text-xs text-muted-foreground">Este mes</span>
            </div>
            <div className="divide-y divide-border">
              {top_productos.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  Sin ventas registradas este mes.
                </p>
              ) : (
                top_productos.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3 p-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {product.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} vendidos
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-success">
                      {formatProveedorCurrency(product.revenue)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
