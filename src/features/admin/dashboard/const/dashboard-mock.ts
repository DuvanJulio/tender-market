import {
  AlertTriangle,
  CheckCircle,
  Package,
  Store,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

export type TDashboardActivityType =
  | "user"
  | "order"
  | "supplier"
  | "product"
  | "alert"

export const ACTIVITY_TYPE_STYLES: Record<
  TDashboardActivityType,
  { className: string; icon: LucideIcon }
> = {
  user: { className: "bg-primary/10 text-primary", icon: UserPlus },
  order: { className: "bg-success/10 text-success", icon: CheckCircle },
  supplier: { className: "bg-accent/10 text-accent", icon: Store },
  product: { className: "bg-warning/10 text-warning", icon: Package },
  alert: { className: "bg-warning/10 text-warning", icon: AlertTriangle },
}
