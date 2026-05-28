import type { TProductoEstado } from "../interfaces"

export type TProductoEstadoFilter = "all" | TProductoEstado

export const PRODUCTO_ESTADO_CONFIG: Record<
  TProductoEstado,
  { label: string; color: string }
> = {
  publicado: {
    label: "Activo",
    color: "bg-success/15 text-success",
  },
  borrador: {
    label: "Pendiente",
    color: "bg-warning/15 text-warning",
  },
  inactivo: {
    label: "Rechazado",
    color: "bg-destructive/15 text-destructive",
  },
}

export const PRODUCTO_ESTADO_FILTER_OPTIONS: {
  value: TProductoEstadoFilter
  label: string
}[] = [
  { value: "all", label: "Todos los estados" },
  { value: "publicado", label: "Activos" },
  { value: "borrador", label: "Pendientes" },
  { value: "inactivo", label: "Rechazados" },
]
