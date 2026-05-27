"use client"

import { AdminModal } from "@/features/admin/components"
import { CATEGORIAS_MOCK } from "../const"

interface CategoriasCreateModalProps {
  open: boolean
  onClose: () => void
}

export function CategoriasCreateModal({
  open,
  onClose,
}: CategoriasCreateModalProps) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Nueva Categoría"
      description="Agrega una nueva categoría para organizar productos"
    >
      <form className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre de la categoría
          </label>
          <input
            type="text"
            placeholder="Ej: Snacks y Confitería"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Slug (URL)
          </label>
          <input
            type="text"
            placeholder="snacks-confiteria"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Categoría padre (opcional)
          </label>
          <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">Ninguna (categoría principal)</option>
            {CATEGORIAS_MOCK.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Crear categoría
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
