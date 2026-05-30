"use client"

import { BarChart3 } from "lucide-react"
import { ProveedorPageHeader } from "../../components"

export function ProveedorEstadisticasView() {
  return (
    <div className="p-4 lg:p-6">
      <ProveedorPageHeader
        title="Estadísticas"
        description="Analiza el rendimiento de tu negocio"
      />
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-6 text-lg font-semibold text-foreground">
          Próximamente
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Los reportes y gráficos de ventas estarán disponibles cuando conectemos
          el módulo de pedidos al backend.
        </p>
      </div>
    </div>
  )
}
