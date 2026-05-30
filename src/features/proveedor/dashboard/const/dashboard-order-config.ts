import {
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  XCircle,
} from "lucide-react"
import type { TProveedorPedidoEstado } from "../interfaces"

export const PROVEEDOR_ORDER_STATUS_CONFIG: Record<
  TProveedorPedidoEstado,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pendiente",
    color: "bg-warning/10 text-warning",
    icon: Clock,
  },
  processing: {
    label: "Procesando",
    color: "bg-primary/10 text-primary",
    icon: Package,
  },
  shipped: {
    label: "Enviado",
    color: "bg-accent/10 text-accent",
    icon: ShoppingCart,
  },
  delivered: {
    label: "Entregado",
    color: "bg-success/10 text-success",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
}
