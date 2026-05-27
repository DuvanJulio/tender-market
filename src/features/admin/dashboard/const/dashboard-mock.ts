import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  Store,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react"

export type TDashboardStat = {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

export type TDashboardActivity = {
  type: "user" | "order" | "supplier" | "alert"
  action: string
  name: string
  time: string
}

export type TDashboardPendingApproval = {
  id: number
  name: string
  date: string
  docs: number
}

export type TDashboardTopCity = {
  name: string
  users: number
  orders: number
  revenue: number
}

export const DASHBOARD_STATS: TDashboardStat[] = [
  {
    title: "Ingresos Totales",
    value: "$458,230,000",
    change: "+18.2%",
    icon: DollarSign,
    color: "bg-success/10 text-success",
  },
  {
    title: "Tenderos Activos",
    value: "10,234",
    change: "+324 este mes",
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Proveedores",
    value: "512",
    change: "+28 verificados",
    icon: Store,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Pedidos Hoy",
    value: "1,847",
    change: "+12% vs ayer",
    icon: ShoppingCart,
    color: "bg-warning/10 text-warning",
  },
]

export const DASHBOARD_RECENT_ACTIVITY: TDashboardActivity[] = [
  { type: "user", action: "Nuevo tendero registrado", name: "Tienda La Esperanza", time: "Hace 2 min" },
  { type: "order", action: "Pedido completado", name: "ORD-8923", time: "Hace 5 min" },
  { type: "supplier", action: "Proveedor verificado", name: "Distribuidora ABC", time: "Hace 15 min" },
  { type: "alert", action: "Reporte de problema", name: "Pedido ORD-8901", time: "Hace 30 min" },
  { type: "user", action: "Nuevo tendero registrado", name: "Mini Mercado Central", time: "Hace 45 min" },
]

export const DASHBOARD_PENDING_APPROVALS: TDashboardPendingApproval[] = [
  { id: 1, name: "Importadora del Norte S.A.", date: "2024-01-20", docs: 5 },
  { id: 2, name: "Lácteos Premium Ltda", date: "2024-01-19", docs: 3 },
  { id: 3, name: "Distribuidora Oriente", date: "2024-01-18", docs: 4 },
]

export const DASHBOARD_TOP_CITIES: TDashboardTopCity[] = [
  { name: "Bogotá", users: 4521, orders: 12450, revenue: 185000000 },
  { name: "Medellín", users: 2834, orders: 7823, revenue: 98500000 },
  { name: "Cali", users: 1567, orders: 4234, revenue: 52300000 },
  { name: "Barranquilla", users: 892, orders: 2156, revenue: 28900000 },
  { name: "Cartagena", users: 654, orders: 1678, revenue: 21400000 },
]

export const ACTIVITY_TYPE_STYLES: Record<
  TDashboardActivity["type"],
  { className: string; icon: LucideIcon }
> = {
  user: { className: "bg-primary/10 text-primary", icon: UserPlus },
  order: { className: "bg-success/10 text-success", icon: CheckCircle },
  supplier: { className: "bg-accent/10 text-accent", icon: Store },
  alert: { className: "bg-warning/10 text-warning", icon: AlertTriangle },
}
