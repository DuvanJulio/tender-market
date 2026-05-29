"use client"

import { useCallback, useEffect, useState } from "react"
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
  selectUsuariosQuery,
  updateUsuarioEstado,
} from "@/store/admin/usuarios-slice"
import { AdminPageHeader, AdminTablePagination } from "@/features/admin/components"
import { DEFAULT_PAGE_SIZE } from "@/types/pagination"
import { toast } from "sonner"
import {
  ROLE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  USUARIO_ROLE_CONFIG,
  estadoAccionToTargetEstado,
  type TUsuarioEstadoAccion,
  type TUsuarioEstadoFilter,
  type TUsuarioRolFilter,
} from "../const"
import type { TAdminUsuario, TFetchUsuariosParams } from "../interfaces"
import { UsuarioRowActions } from "./usuarioRowActions"
import { UsuarioDetailModal } from "./usuarioDetailModal"
import { UsuarioEstadoMenu } from "./usuarioEstadoMenu"
import { UsuarioEstadoAlertDialog } from "./usuarioEstadoAlertDialog"
import { UsuarioDeleteAlertDialog } from "./usuarioDeleteAlertDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

function buildFetchParams(
  page: number,
  searchQuery: string,
  roleFilter: TUsuarioRolFilter,
  statusFilter: TUsuarioEstadoFilter
): TFetchUsuariosParams {
  return {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: searchQuery.trim() || undefined,
    rol: roleFilter === "all" ? undefined : roleFilter,
    estado: statusFilter === "all" ? undefined : statusFilter,
  }
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
  const { status, message, usuarios, pagination } =
    useAppSelector(selectUsuariosListView)
  const listQuery = useAppSelector(selectUsuariosQuery)
  const updateEstadoState = useAppSelector(selectUpdateEstado)
  const deleteState = useAppSelector(selectDeleteUsuario)

  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<TUsuarioRolFilter>("all")
  const [statusFilter, setStatusFilter] = useState<TUsuarioEstadoFilter>("all")
  const [detailUserId, setDetailUserId] = useState<string | null>(null)
  const [estadoUser, setEstadoUser] = useState<TAdminUsuario | null>(null)
  const [estadoAccion, setEstadoAccion] =
    useState<TUsuarioEstadoAccion | null>(null)
  const [deleteUser, setDeleteUser] = useState<TAdminUsuario | null>(null)

  const loadUsuarios = useCallback(() => {
    dispatch(
      fetchUsuarios(buildFetchParams(page, searchQuery, roleFilter, statusFilter))
    )
  }, [dispatch, page, searchQuery, roleFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(loadUsuarios, 300)
    return () => clearTimeout(timer)
  }, [loadUsuarios])

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
        await dispatch(fetchUsuarios(listQuery))
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
      await dispatch(fetchUsuarios(listQuery))
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteUser) return

    const result = await dispatch(deleteUsuario(deleteUser.id))

    if (deleteUsuario.fulfilled.match(result) && result.payload.success) {
      setDeleteUser(null)
      await dispatch(fetchUsuarios(listQuery))
    }
  }

  // Sonner para cambio de estado
  useEffect(() => {
    if (updateEstadoState.status === 'loading') {
      toast.loading("Cambiando estado del usuario...")
    }

    if (updateEstadoState.status === "success") {
      toast.dismiss()
      toast.success(updateEstadoState.message)
    }
  }, [updateEstadoState.status])


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
              onClick={() => {
                setRoleFilter(option.value)
                setPage(1)
              }}
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
              onClick={() => {
                setStatusFilter(option.value)
                setPage(1)
              }}
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
            <Table>
              <TableHeader className="border-b border-border bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Usuario
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Rol
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Negocio
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ciudad
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Estado
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actividad
                  </TableHead>
                  <TableHead className="p-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={7}
                      className="p-8 text-center text-sm text-muted-foreground"
                    >
                      No hay usuarios que coincidan con los filtros
                      seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((user) => {
                    const role = USUARIO_ROLE_CONFIG[user.rol]
                    const RoleIcon = role.icon

                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="p-4 whitespace-normal">
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
                        </TableCell>
                        <TableCell className="p-4 whitespace-normal">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${role.color}`}
                          >
                            <RoleIcon className="h-3.5 w-3.5" />
                            {role.label}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 whitespace-normal">
                          <p className="text-sm text-card-foreground">
                            {user.negocio}
                          </p>
                        </TableCell>
                        <TableCell className="p-4 text-sm text-muted-foreground whitespace-normal">
                          {user.ciudad ?? "—"}
                        </TableCell>
                        <TableCell className="p-4 whitespace-normal">
                          <UsuarioEstadoMenu
                            user={user}
                            isUpdating={
                              updateEstadoState.usuarioId === user.id
                            }
                            onSelectAccion={handleEstadoAccionSelect}
                          />
                        </TableCell>
                        <TableCell className="p-4 whitespace-normal">
                          <div>
                            <p className="text-sm text-card-foreground">
                              {user.pedidos} pedidos
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(user.total_gastado)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="p-4 text-right whitespace-normal">
                          <UsuarioRowActions
                            user={user}
                            onViewDetails={(user) => setDetailUserId(user.id)}
                            onDelete={setDeleteUser}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            <AdminTablePagination
              pagination={pagination}
              itemLabel="usuarios"
              isLoading={isLoading}
              onPageChange={setPage}
            />
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
