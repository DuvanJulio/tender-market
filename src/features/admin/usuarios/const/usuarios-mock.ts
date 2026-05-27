import { Store, TruckIcon, type LucideIcon } from "lucide-react"

export type TUsuarioRole = "tendero" | "proveedor"
export type TUsuarioStatus = "active" | "verified" | "pending" | "inactive"

export type TUsuario = {
  id: number
  name: string
  email: string
  phone: string
  role: TUsuarioRole
  business: string
  city: string
  status: TUsuarioStatus
  orders: number
  totalSpent: number
  joinDate: string
}

export const USUARIOS_MOCK: TUsuario[] = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
    phone: "+57 300 123 4567",
    role: "tendero",
    business: "Tienda Don Pepe",
    city: "Bogotá",
    status: "active",
    orders: 45,
    totalSpent: 2850000,
    joinDate: "2024-01-05",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@ejemplo.com",
    phone: "+57 301 234 5678",
    role: "tendero",
    business: "Mini Mercado La Esquina",
    city: "Medellín",
    status: "active",
    orders: 32,
    totalSpent: 1920000,
    joinDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos@distribuidorasol.com",
    phone: "+57 302 345 6789",
    role: "proveedor",
    business: "Distribuidora Sol S.A.",
    city: "Cali",
    status: "verified",
    orders: 156,
    totalSpent: 45600000,
    joinDate: "2023-11-15",
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    email: "ana@ejemplo.com",
    phone: "+57 303 456 7890",
    role: "tendero",
    business: "Droguería Central",
    city: "Barranquilla",
    status: "pending",
    orders: 0,
    totalSpent: 0,
    joinDate: "2024-01-18",
  },
  {
    id: 5,
    name: "Pedro Martínez",
    email: "pedro@lacteosdelvalle.com",
    phone: "+57 304 567 8901",
    role: "proveedor",
    business: "Lácteos del Valle",
    city: "Bogotá",
    status: "inactive",
    orders: 89,
    totalSpent: 28900000,
    joinDate: "2023-08-20",
  },
]

export const USUARIO_STATUS_CONFIG: Record<
  TUsuarioStatus,
  { label: string; color: string }
> = {
  active: { label: "Activo", color: "bg-success/10 text-success" },
  verified: { label: "Verificado", color: "bg-primary/10 text-primary" },
  pending: { label: "Pendiente", color: "bg-warning/10 text-warning" },
  inactive: { label: "Inactivo", color: "bg-muted text-muted-foreground" },
}

export const USUARIO_ROLE_CONFIG: Record<
  TUsuarioRole,
  { label: string; icon: LucideIcon; color: string }
> = {
  tendero: { label: "Tendero", icon: Store, color: "bg-primary/10 text-primary" },
  proveedor: {
    label: "Proveedor",
    icon: TruckIcon,
    color: "bg-accent/10 text-accent",
  },
}
