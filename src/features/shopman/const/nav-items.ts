import {
  History,
  LayoutGrid,
  Package,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react"

export type TShopmanNavItem = {
  id: string
  href: string
  label: string
  icon: LucideIcon
}

export const SHOPMAN_NAV_ITEMS: TShopmanNavItem[] = [
  { id: "catalog", href: "/shopman/catalog", label: "Catalogo", icon: LayoutGrid },
  { id: "cart", href: "/shopman/cart", label: "Carrito", icon: ShoppingCart },
  { id: "orders", href: "/shopman/orders", label: "Mis Pedidos", icon: Package },
  { id: "history", href: "/shopman/history", label: "Historial", icon: History },
]
