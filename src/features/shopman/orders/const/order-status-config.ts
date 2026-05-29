import {
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { TOrderStatus } from "../interfaces"

type TOrderStatusConfig = {
  label: string
  badge: string
  icon: LucideIcon
  iconWrap: string
  note: string
}

export const ORDER_STATUS_CONFIG: Record<TOrderStatus, TOrderStatusConfig> = {
  entregado: {
    label: "Entregado",
    badge: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    iconWrap: "bg-emerald-100 text-emerald-600",
    note: "text-emerald-600",
  },
  "en-camino": {
    label: "En camino",
    badge: "bg-orange-100 text-orange-700",
    icon: Truck,
    iconWrap: "bg-orange-100 text-orange-600",
    note: "text-muted-foreground",
  },
  procesando: {
    label: "Procesando",
    badge: "bg-blue-100 text-blue-700",
    icon: Package,
    iconWrap: "bg-blue-100 text-blue-600",
    note: "text-muted-foreground",
  },
  cancelado: {
    label: "Cancelado",
    badge: "bg-red-100 text-red-700",
    icon: XCircle,
    iconWrap: "bg-red-100 text-red-600",
    note: "text-red-600",
  },
}
