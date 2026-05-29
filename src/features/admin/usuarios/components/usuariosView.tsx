"use client"

import { useMemo, useState } from "react"
import { Loader2, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  deleteUsuario,
  fetchUsuarios,
  resetDeleteUsuario,
  resetUpdateEstado,
  selectDeleteUsuario,
  selectUpdateEstado,
  selectUsuariosListView,
  updateUsuarioEstado,
} from "@/store/admin/usuarios-slice"
import { AdminPageHeader } from "@/features/admin/components"
import {
  ROLE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  USUARIO_ROLE_CONFIG,
  estadoAccionToTargetEstado,
  matchesEstadoFilter,
  type TUsuarioEstadoAccion,
  type TUsuarioEstadoFilter,
  type TUsuarioRolFilter,
} from "../const"
import type { TAdminUsuario } from "../interfaces"
import { UsuarioRowActions } from "./usuarioRowActions"
import { UsuarioDetailModal } from "./usuarioDetailModal"
import { UsuarioEstadoMenu } from "./usuarioEstadoMenu"
import { UsuarioEstadoAlertDialog } from "./usuarioEstadoAlertDialog"
import { UsuarioDeleteAlertDialog } from "./usuarioDeleteAlertDialog"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

function filterButtonClass(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground hover:text-foreground"
  }`
}

function getInitials(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function UsuariosView() {
  const dispatch = useAppDispatch()
  const { status, message, usuarios } = useAppSelector(selectUsuariosListView)
  const updateEstadoState = useAppSelector(selectUpdateEstado)
  const deleteState = useAppSelector(selectDeleteUsuario)

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<TUsuarioRolFilter>("all")
  const [statusFilter, setStatusFilter] = useState<TUsuarioEstadoFilter>("all")
  const [detailUserId, setDetailUserId] = useState<string | null>(null)
  const [estadoUser, setEstadoUser] = useState<TAdminUsuario | null>(null)
  const [estadoAccion, setEstadoAccion] =
    useState<TUsuarioEstadoAccion | null>(null)
  const [deleteUser, setDeleteUser] = useState<TAdminUsuario | null>(null)

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return usuarios.filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        user.nombre.toLowerCase().includes(query) ||
        (user.email ?? "").toLowerCase().includes(query) ||
        user.negocio.toLowerCase().includes(query)

      const matchesRole = roleFilter === "all" ? true : user.rol === roleFilter

      const matchesStatus = matchesEstadoFilter(user.estado, statusFilter)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [usuarios, searchQuery, roleFilter, statusFilter])

  const isLoading = status === "loading" || status === "idle"
  const isError = status === "error"
  const actionError =
    updateEstadoState.status === "error"
      ? updateEstadoState.message
      : deleteState.status === "error"
        ? deleteState.message
        : null

  const handleEstadoAccionSelect = (
    user: TAdminUsuario,
    accion: TUsuarioEstadoAccion
  ) => {
    dispatch(resetUpdateEstado())
    dispatch(resetDeleteUsuario())
    setEstadoAccion(accion)
    setEstadoUser(user)
  }

  const handleConfirmEstado = async () => {
    if (!estadoUser || !estadoAccion) return

    if (estadoAccion === "rechazar") {
      const result = await dispatch(deleteUsuario(estadoUser.id))

      if (deleteUsuario.fulfilled.match(result) && result.payload.success) {
        setEstadoUser(null)
        setEstadoAccion(null)
        await dispatch(fetchUsuarios())
      }
      return
    }

    const nuevoEstado = estadoAccionToTargetEstado(estadoAccion)
    const result = await dispatch(
      updateUsuarioEstado({
        usuarioId: estadoUser.id,
        estado: nuevoEstado,
      })
    )

    if (updateUsuarioEstado.fulfilled.match(result) && result.payload.success) {
      setEstadoUser(null)
      setEstadoAccion(null)
      await dispatch(fetchUsuarios())
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteUser) return

    const result = await dispatch(deleteUsuario(deleteUser.id))

    if (deleteUsuario.fulfilled.match(result) && result.payload.success) {
      setDeleteUser(null)
      await dispatch(fetchUsuarios())
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader
        title="Usuarios"
        description="Gestiona tenderos y proveedores de la plataforma"
      />

      {isError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message ?? "No se pudieron cargar los usuarios"}
        </div>
      )}

      {actionError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

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
              onClick={() => setRoleFilter(option.value)}
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
              onClick={() => setStatusFilter(option.value)}
              className={filterButtonClass(statusFilter === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
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
                        No hay usuarios que coincidan con los filtros
                        seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const role = USUARIO_ROLE_CONFIG[user.rol]
                      const RoleIcon = role.icon

                      return (
                        <tr
                          key={user.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {getInitials(user.nombre)}
                              </div>
                              <div>
                                <p className="font-medium text-card-foreground">
                                  {user.nombre}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {user.email ?? "Sin email"}
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
                              {user.negocio}
                            </p>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {user.ciudad ?? "—"}
                          </td>
                          <td className="p-4">
                            <UsuarioEstadoMenu
                              user={user}
                              isUpdating={
                                updateEstadoState.usuarioId === user.id
                              }
                              onSelectAccion={handleEstadoAccionSelect}
                            />
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-sm text-card-foreground">
                                {user.pedidos} pedidos
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(user.total_gastado)}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <UsuarioRowActions
                              user={user}
                              onViewDetails={(user) => setDetailUserId(user.id)}
                              onDelete={setDeleteUser}
                            />
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
                Mostrando {filteredUsers.length} de {usuarios.length} usuarios
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
          </>
        )}
      </div>

      <UsuarioDetailModal
        usuarioId={detailUserId}
        open={detailUserId != null}
        onClose={() => setDetailUserId(null)}
      />
      <UsuarioEstadoAlertDialog
        user={estadoUser}
        accion={estadoAccion}
        open={estadoUser != null && estadoAccion != null}
        isLoading={
          estadoAccion === "rechazar"
            ? deleteState.status === "loading"
            : updateEstadoState.status === "loading"
        }
        onOpenChange={(open) => {
          const isBusy =
            deleteState.status === "loading" ||
            updateEstadoState.status === "loading"
          if (!open && !isBusy) {
            setEstadoUser(null)
            setEstadoAccion(null)
            dispatch(resetUpdateEstado())
            dispatch(resetDeleteUsuario())
          }
        }}
        onConfirm={handleConfirmEstado}
      />
      <UsuarioDeleteAlertDialog
        user={deleteUser}
        open={deleteUser != null}
        isDeleting={deleteState.status === "loading"}
        onOpenChange={(open) => {
          if (!open && deleteState.status !== "loading") {
            setDeleteUser(null)
            dispatch(resetDeleteUsuario())
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
