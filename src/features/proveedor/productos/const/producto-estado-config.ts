import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { TProductoEstado } from "../interfaces"

export type TProductoEstadoFilter =
  | "all"
  | TProductoEstado
  | "low-stock"
  | "out-of-stock"

export type TProductoEstadoConfig = {
  label: string
  color: string
  icon: LucideIcon
}

export const PROVEEDOR_PRODUCTO_ESTADO_CONFIG: Record<
  TProductoEstado,
  TProductoEstadoConfig
> = {
  publicado: {
    label: "Publicado",
    color: "bg-success/10 text-success",
    icon: CheckCircle,
  },
  borrador: {
    label: "En revisión",
    color: "bg-warning/10 text-warning",
    icon: Clock,
  },
  inactivo: {
    label: "Inactivo",
    color: "bg-muted text-muted-foreground",
    icon: XCircle,
  },
}

export const PROVEEDOR_PRODUCTO_ESTADO_FILTER_OPTIONS: {
  value: TProductoEstadoFilter
  label: string
}[] = [
  { value: "all", label: "Todos los estados" },
  { value: "publicado", label: "Publicados" },
  { value: "borrador", label: "En revisión" },
  { value: "inactivo", label: "Inactivos" },
  { value: "low-stock", label: "Stock bajo" },
  { value: "out-of-stock", label: "Sin stock" },
]

export const PROVEEDOR_STOCK_BAJO_UMBRAL = 10

export function getStockDisplayConfig(stock: number) {
  if (stock === 0) {
    return {
      label: "Sin stock",
      color: "bg-destructive/10 text-destructive",
      icon: XCircle,
    }
  }
  if (stock <= PROVEEDOR_STOCK_BAJO_UMBRAL) {
    return {
      label: "Stock bajo",
      color: "bg-warning/10 text-warning",
      icon: AlertTriangle,
    }
  }
  return {
    label: "Disponible",
    color: "bg-success/10 text-success",
    icon: Package,
  }
}
