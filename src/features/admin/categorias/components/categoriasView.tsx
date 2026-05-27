"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { AdminPageHeader } from "@/features/admin/components"
import { CATEGORIAS_MOCK } from "../const"
import { CategoriasCreateModal } from "./categoriasCreateModal"
import { CategoriasList } from "./categoriasList"

export function CategoriasView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCategories = useMemo(
    () =>
      CATEGORIAS_MOCK.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  )

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader
        title="Categorías"
        description="Organiza los productos por categorías y subcategorías"
        actions={
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </button>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar categorías..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <CategoriasList categories={filteredCategories} />
      <CategoriasCreateModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}
