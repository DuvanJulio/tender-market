"use client"

import { useMemo, useState } from "react"
import { Filter, Loader2, Package, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  deleteProducto,
  fetchProductos,
  moderateProducto,
  resetDeleteProducto,
  resetModerateProducto,
  selectDeleteProducto,
  selectModerateProducto,
  selectProductosListView,
} from "@/store/admin/productos-slice"
import { AdminPageHeader } from "@/features/admin/components"
import {
  PRODUCTO_ESTADO_CONFIG,
  PRODUCTO_ESTADO_FILTER_OPTIONS,
  type TProductoEstadoFilter,
} from "../const"
import type { TAdminProducto } from "../interfaces"
import { ProductosStatsCards } from "./productosStatsCards"
import { ProductoRowActions } from "./productoRowActions"
import { ProductoDeleteAlertDialog } from "./productoDeleteAlertDialog"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

export function ProductosView() {
  const dispatch = useAppDispatch()
  const { status, message, productos, summary } = useAppSelector(
    selectProductosListView
  )
  const moderateState = useAppSelector(selectModerateProducto)
  const deleteState = useAppSelector(selectDeleteProducto)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TProductoEstadoFilter>("all")
  const [productoToDelete, setProductoToDelete] = useState<TAdminProducto | null>(
    null
  )

  const filteredProductos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return productos.filter((producto) => {
      const matchesSearch =
        query.length === 0 ||
        producto.nombre.toLowerCase().includes(query) ||
        (producto.proveedor ?? "").toLowerCase().includes(query) ||
        (producto.categoria ?? "").toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === "all" ? true : producto.estado === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [productos, searchQuery, statusFilter])

  const isLoading = status === "loading" || status === "idle"
  const isError = status === "error"
  const moderateError =
    moderateState.status === "error" ? moderateState.message : null
  const deleteError =
    deleteState.status === "error" ? deleteState.message : null

  const handleApprove = async (producto: TAdminProducto) => {
    dispatch(resetModerateProducto())
    const result = await dispatch(
      moderateProducto({ productoId: producto.id, estado: "publicado" })
    )
    if (moderateProducto.fulfilled.match(result) && !result.payload.success) {
      return
    }
    if (moderateProducto.fulfilled.match(result) && result.payload.success) {
      await dispatch(fetchProductos())
    }
  }

  const handleReject = async (producto: TAdminProducto) => {
    dispatch(resetModerateProducto())
    const result = await dispatch(
      moderateProducto({ productoId: producto.id, estado: "inactivo" })
    )
    if (moderateProducto.fulfilled.match(result) && result.payload.success) {
      await dispatch(fetchProductos())
    }
  }

  const handleDeleteRequest = (producto: TAdminProducto) => {
    dispatch(resetDeleteProducto())
    setProductoToDelete(producto)
  }

  const handleConfirmDelete = async () => {
    if (!productoToDelete) return

    const result = await dispatch(deleteProducto(productoToDelete.id))

    if (deleteProducto.fulfilled.match(result) && result.payload.success) {
      setProductoToDelete(null)
      await dispatch(fetchProductos())
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader
        title="Gestión de Productos"
        description="Administra y modera los productos de los proveedores"
      />

      {isError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message ?? "No se pudieron cargar los productos"}
        </div>
      )}

      {(moderateError || deleteError) && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {moderateError ?? deleteError}
        </div>
      )}

      <ProductosStatsCards summary={summary} isLoading={isLoading} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
            aria-label="Filtros"
            title="Filtros adicionales (próximamente)"
            disabled
          >
            <Filter className="h-4 w-4" />
          </button>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TProductoEstadoFilter)
            }
            className="h-10 min-w-[180px] rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {PRODUCTO_ESTADO_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                      Producto
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Proveedor
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Categoría
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Precio
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Stock
                    </th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Estado
                    </th>
                    <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProductos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-sm text-muted-foreground"
                      >
                        No hay productos que coincidan con los filtros
                        seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredProductos.map((producto) => {
                      const estadoConfig =
                        PRODUCTO_ESTADO_CONFIG[producto.estado]
                      const isModerating =
                        moderateState.productoId === producto.id
                      const isDeleting = deleteState.productoId === producto.id

                      return (
                        <tr
                          key={producto.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                {producto.imagen_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={producto.imagen_url}
                                    alt=""
                                    className="h-full w-full rounded-lg object-cover"
                                  />
                                ) : (
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <p className="font-medium text-card-foreground">
                                {producto.nombre}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-card-foreground">
                            {producto.proveedor ?? "—"}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {producto.categoria ?? "—"}
                          </td>
                          <td className="p-4 text-sm font-medium text-card-foreground">
                            {formatPrice(producto.precio)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-sm font-medium ${
                                producto.stock === 0
                                  ? "text-destructive"
                                  : "text-card-foreground"
                              }`}
                            >
                              {producto.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${estadoConfig.color}`}
                            >
                              {estadoConfig.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <ProductoRowActions
                              producto={producto}
                              isModerating={isModerating}
                              isDeleting={isDeleting}
                              onApprove={() => handleApprove(producto)}
                              onReject={() => handleReject(producto)}
                              onDelete={() => handleDeleteRequest(producto)}
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
                Mostrando {filteredProductos.length} de {productos.length}{" "}
                productos
              </p>
            </div>
          </>
        )}
      </div>

      <ProductoDeleteAlertDialog
        producto={productoToDelete}
        open={productoToDelete != null}
        isDeleting={deleteState.status === "loading"}
        onOpenChange={(open) => {
          if (!open) {
            setProductoToDelete(null)
            dispatch(resetDeleteProducto())
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
