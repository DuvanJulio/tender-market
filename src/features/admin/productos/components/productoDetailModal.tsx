"use client"

import { Package } from "lucide-react"
import { AdminModal } from "@/features/admin/components"
import { PRODUCTO_ESTADO_CONFIG } from "../const"
import type { TAdminProducto } from "../interfaces"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

interface ProductoDetailModalProps {
  open: boolean
  producto: TAdminProducto | null
  onClose: () => void
}

export function ProductoDetailModal({
  open,
  producto,
  onClose,
}: ProductoDetailModalProps) {
  if (!producto) return null

  const estadoConfig = PRODUCTO_ESTADO_CONFIG[producto.estado]

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Detalle del producto"
      description={producto.nombre}
      size="lg"
    >
      <div className="mt-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
            {producto.imagen_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nombre
              </p>
              <p className="text-sm font-medium text-card-foreground">
                {producto.nombre}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Estado
              </p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${estadoConfig.color}`}
              >
                {estadoConfig.label}
              </span>
            </div>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-xs text-muted-foreground">Proveedor</dt>
            <dd className="mt-1 text-sm font-medium text-card-foreground">
              {producto.proveedor ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-xs text-muted-foreground">Categoría</dt>
            <dd className="mt-1 text-sm font-medium text-card-foreground">
              {producto.categoria ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-xs text-muted-foreground">Precio mayorista</dt>
            <dd className="mt-1 text-sm font-medium text-card-foreground">
              {formatPrice(producto.precio)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-xs text-muted-foreground">Stock</dt>
            <dd
              className={`mt-1 text-sm font-medium ${
                producto.stock === 0 ? "text-destructive" : "text-card-foreground"
              }`}
            >
              {producto.stock}
            </dd>
          </div>
        </dl>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cerrar
          </button>
        </div>
      </div>
    </AdminModal>
  )
}
