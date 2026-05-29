import { CheckCircle2, XCircle, type LucideIcon } from "lucide-react"
import type { THistoryStatus } from "../interfaces"

type THistoryStatusConfig = {
  label: string
  badge: string
  icon: LucideIcon
  iconWrap: string
  note: string
}

export const HISTORY_STATUS_CONFIG: Record<
  THistoryStatus,
  THistoryStatusConfig
> = {
  entregado: {
    label: "Entregado",
    badge: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    iconWrap: "bg-emerald-100 text-emerald-600",
    note: "text-emerald-600",
  },
  cancelado: {
    label: "Cancelado",
    badge: "bg-red-100 text-red-700",
    icon: XCircle,
    iconWrap: "bg-red-100 text-red-600",
    note: "text-red-600",
  },
}
