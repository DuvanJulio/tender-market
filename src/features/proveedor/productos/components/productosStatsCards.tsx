import type { TProveedorProductosSummary } from "../interfaces"

interface ProductosStatsCardsProps {
  summary: TProveedorProductosSummary
  isLoading: boolean
}

function StatCard({
  label,
  value,
  valueClassName,
  isLoading,
}: {
  label: string
  value: number
  valueClassName?: string
  isLoading: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p
        className={`text-2xl font-bold ${valueClassName ?? "text-card-foreground"}`}
      >
        {isLoading ? "—" : value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function ProductosStatsCards({
  summary,
  isLoading,
}: ProductosStatsCardsProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Total" value={summary.total} isLoading={isLoading} />
      <StatCard
        label="Publicados"
        value={summary.activos}
        valueClassName="text-success"
        isLoading={isLoading}
      />
      <StatCard
        label="En revisión"
        value={summary.pendientes}
        valueClassName="text-warning"
        isLoading={isLoading}
      />
      <StatCard
        label="Inactivos"
        value={summary.inactivos}
        isLoading={isLoading}
      />
      <StatCard
        label="Stock bajo"
        value={summary.bajo_stock}
        valueClassName="text-warning"
        isLoading={isLoading}
      />
    </div>
  )
}
