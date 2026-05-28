"use client"

import { Check, Eye, Loader2, Trash2, X } from "lucide-react"
import type { TAdminProducto } from "../interfaces"

interface ProductoRowActionsProps {
  producto: TAdminProducto
  isModerating: boolean
  isDeleting: boolean
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
}

export function ProductoRowActions({
  producto,
  isModerating,
  isDeleting,
  onApprove,
  onReject,
  onDelete,
}: ProductoRowActionsProps) {
  const isPending = producto.estado === "borrador"
  const busy = isModerating || isDeleting

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Ver producto"
        title="Ver detalle (próximamente)"
        disabled
      >
        <Eye className="h-4 w-4" />
      </button>

      {isPending && (
        <>
          <button
            type="button"
            onClick={onApprove}
            disabled={busy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-success transition-colors hover:bg-success/10 disabled:opacity-50"
            aria-label="Aprobar producto"
          >
            {isModerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={busy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            aria-label="Rechazar producto"
          >
            {isModerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        aria-label="Eliminar producto"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
