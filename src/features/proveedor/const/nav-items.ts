import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Package,
  type LucideIcon,
} from "lucide-react"

export type TProveedorNavItem = {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

export const PROVEEDOR_NAV_ITEMS: TProveedorNavItem[] = [
  { href: "/proveedor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proveedor/productos", label: "Productos", icon: Package },
  {
    href: "/proveedor/pedidos",
    label: "Pedidos",
    icon: ClipboardList,
    badge: 5,
  },
  { href: "/proveedor/estadisticas", label: "Estadísticas", icon: BarChart3 },
]

export const PROVEEDOR_MOCK_PROFILE = {
  initials: "DS",
  nombre: "Distribuidora Sol",
  rol: "Proveedor verificado",
  email: "contacto@distribuidorasol.com",
}
