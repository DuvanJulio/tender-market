"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  DollarSign,
  Loader2,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchDashboardStats,
  selectDashboardStats,
} from "@/store/admin/dashboard-slice"
import { ACTIVITY_TYPE_STYLES, type TDashboardActivityType } from "../const"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    notation: "compact",
  }).format(price)
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("es-CO", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 10_000 ? 1 : 0,
  }).format(value)
}

function formatPercentChange(value: number | null, suffix: string) {
  if (value === null) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${value}% ${suffix}`
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

function formatRegistrationDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function activityTypeStyle(
  type: string
): (typeof ACTIVITY_TYPE_STYLES)[TDashboardActivityType] {
  if (type in ACTIVITY_TYPE_STYLES) {
    return ACTIVITY_TYPE_STYLES[type as TDashboardActivityType]
  }
  return ACTIVITY_TYPE_STYLES.user
}

export function DashboardView() {
  const dispatch = useAppDispatch()
  const { status, data } = useAppSelector(selectDashboardStats)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDashboardStats())
    }
  }, [dispatch, status])

  const statCards = useMemo(() => {
    if (!data) return []

    const ingresosChange =
      data.ingresos_cambio_porcentaje !== null
        ? formatPercentChange(data.ingresos_cambio_porcentaje, "")
        : "—"

    const pedidosChange =
      data.pedidos_cambio_porcentaje !== null
        ? formatPercentChange(data.pedidos_cambio_porcentaje, "vs ayer")
        : "—"

    return [
      {
        title: "Ingresos Totales",
        value: formatPrice(data.ingresos_totales),
        change: ingresosChange,
        icon: DollarSign,
        color: "bg-success/10 text-success",
      },
      {
        title: "Tenderos Activos",
        value: formatCompactNumber(data.tenderos_activos),
        change: `+${data.tenderos_nuevos_mes} este mes`,
        icon: Users,
        color: "bg-primary/10 text-primary",
      },
      {
        title: "Proveedores",
        value: formatCompactNumber(data.proveedores_activos),
        change: `+${data.proveedores_nuevos_mes} este mes`,
        icon: Store,
        color: "bg-accent/10 text-accent",
      },
      {
        title: "Pedidos Hoy",
        value: formatCompactNumber(data.pedidos_hoy),
        change: pedidosChange,
        icon: ShoppingCart,
        color: "bg-warning/10 text-warning",
      },
    ]
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
        No se pudieron cargar las estadísticas del dashboard.
      </div>
    )
  }

  const pendingApprovals = data.aprobaciones_pendientes ?? []
  const recentActivity = data.actividad_reciente ?? []
  const topCities = data.top_ciudades ?? []

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
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
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
              Actividad Reciente
            </h2>
            <Link
              href="/admin/usuarios"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              Ver todo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Sin actividad reciente.
              </p>
            ) : (
              recentActivity.map((activity, index) => {
                const style = activityTypeStyle(activity.type)
                const ActivityIcon = style.icon
                return (
                  <div
                    key={`${activity.occurred_at}-${index}`}
                    className="flex items-center gap-4 p-4"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.className}`}
                    >
                      <ActivityIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.name}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.occurred_at)}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-card-foreground">
              Aprobaciones Pendientes
            </h2>
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
              {pendingApprovals.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {pendingApprovals.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No hay aprobaciones pendientes.
              </p>
            ) : (
              pendingApprovals.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Store className="h-5 w-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.tipo === "proveedor" ? "Proveedor" : "Tendero"} ·{" "}
                        {formatRegistrationDate(item.fecha_registro)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/admin/usuarios?estado=pendiente`}
                      className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Revisar
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold text-card-foreground">Top Ciudades</h2>
          <Link
            href="/admin/ciudades"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            Ver todas
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <Table>
          <TableHeader className="border-b border-border bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ciudad
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Usuarios
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pedidos
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ingresos
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-4 text-center text-sm text-muted-foreground"
                >
                  Sin datos por ciudad.
                </TableCell>
              </TableRow>
            ) : (
              topCities.map((city, index) => (
                <TableRow
                  key={city.ciudad_id}
                  className="hover:bg-muted/30"
                >
                  <TableCell className="p-4 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-card-foreground">
                        {city.nombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground whitespace-normal">
                    {city.usuarios.toLocaleString("es-CO")}
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground whitespace-normal">
                    {city.pedidos.toLocaleString("es-CO")}
                  </TableCell>
                  <TableCell className="p-4 text-sm font-semibold text-success whitespace-normal">
                    {formatPrice(city.ingresos)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
