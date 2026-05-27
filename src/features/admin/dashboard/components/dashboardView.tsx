"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  Store,
  TrendingUp,
} from "lucide-react"
import {
  ACTIVITY_TYPE_STYLES,
  DASHBOARD_PENDING_APPROVALS,
  DASHBOARD_RECENT_ACTIVITY,
  DASHBOARD_STATS,
  DASHBOARD_TOP_CITIES,
} from "../const"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    notation: "compact",
  }).format(price)
}

export function DashboardView() {
  return (
    <div className="p-4 lg:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
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
              href="/admin/actividad"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              Ver todo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {DASHBOARD_RECENT_ACTIVITY.map((activity, index) => {
              const style = ACTIVITY_TYPE_STYLES[activity.type]
              const ActivityIcon = style.icon
              return (
                <div key={index} className="flex items-center gap-4 p-4">
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
                    {activity.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-card-foreground">
              Aprobaciones Pendientes
            </h2>
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
              {DASHBOARD_PENDING_APPROVALS.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {DASHBOARD_PENDING_APPROVALS.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Store className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.docs} documentos
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Revisar
                  </button>
                </div>
              </div>
            ))}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ciudad
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Usuarios
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pedidos
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DASHBOARD_TOP_CITIES.map((city, index) => (
                <tr
                  key={city.name}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-card-foreground">
                        {city.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {city.users.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {city.orders.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-semibold text-success">
                    {formatPrice(city.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
