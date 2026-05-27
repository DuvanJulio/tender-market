import {
  FolderTree,
  LayoutDashboard,
  MapPin,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react"

export type TAdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const ADMIN_NAV_ITEMS: TAdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/ciudades", label: "Ciudades", icon: MapPin },
]
