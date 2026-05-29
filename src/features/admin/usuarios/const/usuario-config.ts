import { Store, TruckIcon, type LucideIcon } from "lucide-react"
import type { TUsuarioEstado, TUsuarioRol } from "../interfaces"

export const USUARIO_STATUS_CONFIG: Record<
  TUsuarioEstado,
  { label: string; description: string; color: string }
> = {
  pendiente: {
    label: "Pendiente",
    description: "Recién registrado; esperando aprobación del administrador",
    color: "bg-warning/10 text-warning",
  },
  activo: {
    label: "Activo",
    description: "Puede iniciar sesión y usar la plataforma",
    color: "bg-success/10 text-success",
  },
  inactivo: {
    label: "Inactivo",
    description: "Cuenta bloqueada por el admin o dada de baja",
    color: "bg-destructive/10 text-destructive",
  },
}

export const USUARIO_ROLE_CONFIG: Record<
  TUsuarioRol,
  { label: string; icon: LucideIcon; color: string }
> = {
  tendero: {
    label: "Tendero",
    icon: Store,
    color: "bg-primary/10 text-primary",
  },
  proveedor: {
    label: "Proveedor",
    icon: TruckIcon,
    color: "bg-accent/10 text-accent",
  },
}

export type TUsuarioRolFilter = "all" | TUsuarioRol
export type TUsuarioEstadoFilter = "all" | TUsuarioEstado

export const ROLE_FILTER_OPTIONS: { value: TUsuarioRolFilter; label: string }[] =
  [
    { value: "all", label: "Todos los roles" },
    { value: "tendero", label: "Tenderos" },
    { value: "proveedor", label: "Proveedores" },
  ]

export const STATUS_FILTER_OPTIONS: {
  value: TUsuarioEstadoFilter
  label: string
}[] = [
  { value: "all", label: "Todos los estados" },
  { value: "pendiente", label: "Pendientes" },
  { value: "activo", label: "Activos" },
  { value: "inactivo", label: "Inactivos" },
]
