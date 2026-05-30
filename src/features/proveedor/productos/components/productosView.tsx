"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Package, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  deleteProducto,
  fetchProductos,
  resetDeleteProducto,
  selectDeleteProveedorProducto,
  selectProveedorProductosListView,
  selectProveedorProductosQuery,
} from "@/store/proveedor/productos-slice"
import { AdminTablePagination } from "@/features/admin/components"
import { ProveedorPageHeader } from "../../components"
import { formatProveedorCurrency } from "../../const"
import { DEFAULT_PAGE_SIZE } from "@/types/pagination"
import {
  PROVEEDOR_PRODUCTO_ESTADO_CONFIG,
  PROVEEDOR_PRODUCTO_ESTADO_FILTER_OPTIONS,
  getStockDisplayConfig,
  type TProductoEstadoFilter,
} from "../const"
import type {
  TFetchProveedorProductosParams,
  TProveedorProducto,
} from "../interfaces"
import { ProductoDeleteAlertDialog } from "./productoDeleteAlertDialog"
import { ProductoFormModal } from "./productoFormModal"
import { ProductoRowActions } from "./productoRowActions"
import { ProductosStatsCards } from "./productosStatsCards"

function buildFetchParams(
  page: number,
  searchQuery: string,
  statusFilter: TProductoEstadoFilter
): TFetchProveedorProductosParams {
  const base: TFetchProveedorProductosParams = {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: searchQuery.trim() || undefined,
  }

  if (statusFilter === "low-stock") {
    return { ...base, bajo_stock: true }
  }
  if (statusFilter === "out-of-stock") {
    return { ...base, sin_stock: true }
  }
  if (statusFilter === "all") {
    return base
  }

  return { ...base, estado: statusFilter }
}

export function ProveedorProductosView() {
  const dispatch = useAppDispatch()
  const { status, message, productos, summary, pagination } = useAppSelector(
    selectProveedorProductosListView
  )
  const listQuery = useAppSelector(selectProveedorProductosQuery)
  const deleteState = useAppSelector(selectDeleteProveedorProducto)

  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TProductoEstadoFilter>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingProducto, setEditingProducto] =
    useState<TProveedorProducto | null>(null)
  const [productoToDelete, setProductoToDelete] =
    useState<TProveedorProducto | null>(null)

  const loadProductos = useCallback(() => {
    dispatch(fetchProductos(buildFetchParams(page, searchQuery, statusFilter)))
  }, [dispatch, page, searchQuery, statusFilter])

  useEffect(() => {
    const timer = setTimeout(loadProductos, 300)
    return () => clearTimeout(timer)
  }, [loadProductos])

  const isLoading = status === "loading" || status === "idle"
  const isError = status === "error"

  const handleOpenCreate = () => {
    setEditingProducto(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (producto: TProveedorProducto) => {
    setEditingProducto(producto)
    setFormOpen(true)
  }

  const handleSaved = async () => {
    toast.success(
      editingProducto
        ? "Producto actualizado correctamente"
        : "Producto creado. Quedará en revisión hasta su publicación."
    )
    await dispatch(fetchProductos(listQuery))
  }

  const handleConfirmDelete = async () => {
    if (!productoToDelete) return

    const result = await dispatch(deleteProducto(productoToDelete.id))

    if (deleteProducto.fulfilled.match(result) && result.payload.success) {
      toast.success("Producto eliminado")
      setProductoToDelete(null)
      await dispatch(fetchProductos(listQuery))
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <ProveedorPageHeader
        title="Productos"
        description="Gestiona tu catálogo de productos e inventario"
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </button>
        }
      />

      {isError ? (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message ?? "No se pudieron cargar los productos"}
        </div>
      ) : null}

      <ProductosStatsCards summary={summary} isLoading={isLoading} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar por nombre..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as TProductoEstadoFilter)
            setPage(1)
          }}
          className="h-10 min-w-[180px] rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {PROVEEDOR_PRODUCTO_ESTADO_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
                    Producto
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Categoría
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Precio
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Stock
                  </TableHead>
                  <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Estado
                  </TableHead>
                  <TableHead className="p-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={6}
                      className="p-8 text-center text-sm text-muted-foreground"
                    >
                      No hay productos que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  productos.map((producto) => {
                    const estadoConfig =
                      PROVEEDOR_PRODUCTO_ESTADO_CONFIG[producto.estado]
                    const EstadoIcon = estadoConfig.icon
                    const stockConfig = getStockDisplayConfig(producto.stock)
                    const StockIcon = stockConfig.icon

                    return (
                      <TableRow
                        key={producto.id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="p-4 whitespace-normal">
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
                        </TableCell>
                        <TableCell className="p-4 text-sm text-muted-foreground whitespace-normal">
                          {producto.categoria ?? "—"}
                        </TableCell>
                        <TableCell className="p-4 text-sm font-semibold text-card-foreground whitespace-normal">
                          {formatProveedorCurrency(producto.precio)}
                        </TableCell>
                        <TableCell className="p-4 whitespace-normal">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${stockConfig.color}`}
                          >
                            <StockIcon className="h-3.5 w-3.5" />
                            {producto.stock} uds
                          </span>
                        </TableCell>
                        <TableCell className="p-4 whitespace-normal">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${estadoConfig.color}`}
                          >
                            <EstadoIcon className="h-3.5 w-3.5" />
                            {estadoConfig.label}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 text-right whitespace-normal">
                          <ProductoRowActions
                            producto={producto}
                            onEdit={handleOpenEdit}
                            onDelete={setProductoToDelete}
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
              itemLabel="productos"
              isLoading={isLoading}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ProductoFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingProducto(null)
        }}
        producto={editingProducto}
        onSaved={handleSaved}
      />

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
