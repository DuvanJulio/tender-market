"use client"

import { Fragment, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  FolderTree,
  Loader2,
  Package,
  Plus,
  Trash2,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  TCategoria,
  TDeleteCategoriaTarget,
  TEditCategoriaTarget,
} from "../interfaces"

interface CategoriasListProps {
  categories: TCategoria[]
  isLoading?: boolean
  deletingId: number | null
  editingId: number | null
  onEdit: (target: TEditCategoriaTarget) => void
  onDelete: (target: TDeleteCategoriaTarget) => void
  onAddSubcategoria: (parentId: number) => void
}

export function CategoriasList({
  categories,
  isLoading = false,
  deletingId,
  editingId,
  onEdit,
  onDelete,
  onAddSubcategoria,
}: CategoriasListProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        No hay categorías registradas. Crea la primera con el botón superior.
      </div>
    )
  }

  return (
    <Table>
        <TableHeader className="border-b border-border bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categoría
            </TableHead>
            <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Productos
            </TableHead>
            <TableHead className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subcategorías
            </TableHead>
            <TableHead className="p-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id)

            return (
              <Fragment key={category.id}>
                <TableRow className="hover:bg-muted/30">
                  <TableCell className="p-4 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FolderTree className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {category.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          /{category.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 whitespace-normal">
                    <span className="rounded-lg bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground">
                      {category.productos}
                    </span>
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground whitespace-normal">
                    {category.subcategorias.length} subcategorías
                  </TableCell>
                  <TableCell className="p-4 text-right whitespace-normal">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit({
                            id: category.id,
                            nombre: category.nombre,
                            slug: category.slug,
                            estado: category.estado,
                            esSubcategoria: false,
                          })
                        }
                        disabled={
                          editingId === category.id || deletingId === category.id
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                        aria-label="Editar categoría"
                      >
                        {editingId === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onDelete({
                            id: category.id,
                            nombre: category.nombre,
                            esSubcategoria: false,
                          })
                        }
                        disabled={
                          deletingId === category.id || editingId === category.id
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        aria-label="Eliminar categoría"
                      >
                        {deletingId === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>

                {isExpanded &&
                  category.subcategorias.map((sub) => (
                    <TableRow
                      key={`${category.id}-sub-${sub.id}`}
                      className="bg-muted/20 hover:bg-muted/30"
                    >
                      <TableCell className="p-4 pl-16 whitespace-normal">
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-card-foreground">
                            {sub.nombre}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-sm text-muted-foreground whitespace-normal">
                        {sub.productos}
                      </TableCell>
                      <TableCell className="p-4 whitespace-normal" />
                      <TableCell className="p-4 text-right whitespace-normal">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onEdit({
                                id: sub.id,
                                nombre: sub.nombre,
                                slug: sub.slug,
                                estado: sub.estado,
                                esSubcategoria: true,
                              })
                            }
                            disabled={
                              editingId === sub.id || deletingId === sub.id
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                            aria-label="Editar subcategoría"
                          >
                            {editingId === sub.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Edit className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onDelete({
                                id: sub.id,
                                nombre: sub.nombre,
                                esSubcategoria: true,
                              })
                            }
                            disabled={
                              deletingId === sub.id || editingId === sub.id
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                            aria-label="Eliminar subcategoría"
                          >
                            {deletingId === sub.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {isExpanded ? (
                  <TableRow
                    key={`${category.id}-add-sub`}
                    className="bg-muted/20 hover:bg-muted/30"
                  >
                    <TableCell colSpan={4} className="p-4 pl-16 whitespace-normal">
                      <button
                        type="button"
                        onClick={() => onAddSubcategoria(category.id)}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar subcategoría
                      </button>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
  )
}
