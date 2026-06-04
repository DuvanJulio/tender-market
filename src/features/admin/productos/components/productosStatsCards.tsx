import type { TAdminProductosSummary } from "../interfaces"

interface ProductosStatsCardsProps {
  summary: TAdminProductosSummary | null
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
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Productos"
        value={summary?.total ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        label="Activos"
        value={summary?.activos ?? 0}
        valueClassName="text-success"
        isLoading={isLoading}
      />
      <StatCard
        label="Pendientes"
        value={summary?.pendientes ?? 0}
        valueClassName="text-warning"
        isLoading={isLoading}
      />
      <StatCard
        label="Inactivos"
        value={summary?.rechazados ?? 0}
        valueClassName="text-destructive"
        isLoading={isLoading}
      />
    </div>
  )
}
