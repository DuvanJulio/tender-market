"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  FolderTree,
  Package,
  Plus,
  Trash2,
} from "lucide-react"
import type { TCategoria } from "../const"

interface CategoriasListProps {
  categories: TCategoria[]
}

export function CategoriasList({ categories }: CategoriasListProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 p-4">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-5">Categoría</div>
          <div className="col-span-2">Productos</div>
          <div className="col-span-3">Subcategorías</div>
          <div className="col-span-2">Acciones</div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-muted/30">
              <div className="col-span-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                >
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FolderTree className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{category.slug}
                  </p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="rounded-lg bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground">
                  {category.products}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-sm text-muted-foreground">
                  {category.subcategories.length} subcategorías
                </span>
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expandedCategories.includes(category.id) && (
              <div className="bg-muted/20">
                {category.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="grid grid-cols-12 items-center gap-4 border-t border-border/50 py-3 pl-20 pr-4"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-card-foreground">
                        {sub.name}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-muted-foreground">
                        {sub.products}
                      </span>
                    </div>
                    <div className="col-span-3" />
                    <div className="col-span-2 flex gap-2">
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border/50 py-3 pl-20 pr-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar subcategoría
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
