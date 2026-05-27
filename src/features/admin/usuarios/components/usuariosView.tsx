"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { AdminPageHeader } from "@/features/admin/components"
import {
  USUARIO_ROLE_CONFIG,
  USUARIO_STATUS_CONFIG,
  USUARIOS_MOCK,
  type TUsuarioRole,
  type TUsuarioStatus,
} from "../const"
import { UsuarioRowActions } from "./usuarioRowActions"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

type TRoleFilter = "all" | TUsuarioRole
type TStatusFilter = "all" | TUsuarioStatus

const ROLE_FILTER_OPTIONS: { value: TRoleFilter; label: string }[] = [
  { value: "all", label: "Todos los roles" },
  { value: "tendero", label: "Tenderos" },
  { value: "proveedor", label: "Proveedores" },
]

const STATUS_FILTER_OPTIONS: { value: TStatusFilter; label: string }[] = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activos" },
  { value: "verified", label: "Verificados" },
  { value: "pending", label: "Pendientes" },
  { value: "inactive", label: "Inactivos" },
]

function filterButtonClass(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground hover:text-foreground"
  }`
}

export function UsuariosView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<TRoleFilter>("all")
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("all")
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return USUARIOS_MOCK.filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.business.toLowerCase().includes(query)

      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter

      const matchesStatus =
        statusFilter === "all" ? true : user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [searchQuery, roleFilter, statusFilter])

  const handleRoleFilter = (value: TRoleFilter) => {
    setRoleFilter(value)
  }

  const handleStatusFilter = (value: TStatusFilter) => {
    setStatusFilter(value)
  }

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader
        title="Usuarios"
        description="Gestiona tenderos y proveedores de la plataforma"
      />

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, email o negocio..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleRoleFilter(option.value)}
              className={filterButtonClass(roleFilter === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleStatusFilter(option.value)}
              className={filterButtonClass(statusFilter === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Usuario
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rol
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Negocio
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ciudad
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actividad
                </th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-sm text-muted-foreground"
                  >
                    No hay usuarios que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const status = USUARIO_STATUS_CONFIG[user.status]
                  const role = USUARIO_ROLE_CONFIG[user.role]
                  const RoleIcon = role.icon

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${role.color}`}
                        >
                          <RoleIcon className="h-3.5 w-3.5" />
                          {role.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-card-foreground">
                          {user.business}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.city}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-card-foreground">
                            {user.orders} pedidos
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(user.totalSpent)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <UsuarioRowActions user={user} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredUsers.length} de {USUARIOS_MOCK.length} usuarios
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
