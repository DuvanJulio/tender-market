import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react"

export type TProveedorPedidoStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type TProveedorPedidoAction = {
  label: string
  targetStatus: TProveedorPedidoStatus
}

export type TProveedorPedidoStatusConfig = {
  label: string
  color: string
  icon: LucideIcon
  actions: TProveedorPedidoAction[]
}

export const PROVEEDOR_PEDIDO_STATUS_CONFIG: Record<
  TProveedorPedidoStatus,
  TProveedorPedidoStatusConfig
> = {
  pending: {
    label: "Pendiente",
    color: "bg-warning/10 text-warning border-warning/30",
    icon: Clock,
    actions: [
      { label: "Confirmar", targetStatus: "processing" },
      { label: "Rechazar", targetStatus: "cancelled" },
    ],
  },
  processing: {
    label: "Procesando",
    color: "bg-primary/10 text-primary border-primary/30",
    icon: Package,
    actions: [{ label: "Marcar enviado", targetStatus: "shipped" }],
  },
  shipped: {
    label: "Enviado",
    color: "bg-accent/10 text-accent border-accent/30",
    icon: Truck,
    actions: [{ label: "Marcar entregado", targetStatus: "delivered" }],
  },
  delivered: {
    label: "Entregado",
    color: "bg-success/10 text-success border-success/30",
    icon: CheckCircle,
    actions: [],
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-destructive/10 text-destructive border-destructive/30",
    icon: XCircle,
    actions: [],
  },
}

export const PROVEEDOR_PEDIDO_FILTER_OPTIONS: {
  value: TProveedorPedidoStatus | "all"
  label: string
}[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "Procesando" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
]
