"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  deleteCategoria,
  fetchCategorias,
  resetDeleteCategoria,
  selectCategoriasListView,
  selectCategoriasQuery,
  selectDeleteCategoria,
} from "@/store/admin/categorias-slice"
import { AdminPageHeader, AdminTablePagination } from "@/features/admin/components"
import { DEFAULT_PAGE_SIZE } from "@/types/pagination"
import type { TDeleteCategoriaTarget, TFetchCategoriasParams } from "../interfaces"
import { CategoriasCreateModal } from "./categoriasCreateModal"
import { CategoriasList } from "./categoriasList"
import { CategoriaDeleteAlertDialog } from "./categoriaDeleteAlertDialog"

function buildFetchParams(
  page: number,
  searchQuery: string
): TFetchCategoriasParams {
  return {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: searchQuery.trim() || undefined,
  }
}

export function CategoriasView() {
  const dispatch = useAppDispatch()
  const { status, message, categorias, pagination } = useAppSelector(
    selectCategoriasListView
  )
  const listQuery = useAppSelector(selectCategoriasQuery)
  const deleteState = useAppSelector(selectDeleteCategoria)

  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [parentIdForSub, setParentIdForSub] = useState<number | null>(null)
  const [targetToDelete, setTargetToDelete] =
    useState<TDeleteCategoriaTarget | null>(null)

  const loadCategorias = useCallback(() => {
    dispatch(fetchCategorias(buildFetchParams(page, searchQuery)))
  }, [dispatch, page, searchQuery])

  useEffect(() => {
    const timer = setTimeout(loadCategorias, 300)
    return () => clearTimeout(timer)
  }, [loadCategorias])

  const isLoading = status === "loading" || status === "idle"
  const isError = status === "error"
  const deleteError =
    deleteState.status === "error" ? deleteState.message : null

  const handleOpenCreate = () => {
    setParentIdForSub(null)
    setShowAddModal(true)
  }

  const handleAddSubcategoria = (parentId: number) => {
    setParentIdForSub(parentId)
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setParentIdForSub(null)
  }

  const handleDeleteRequest = (target: TDeleteCategoriaTarget) => {
    dispatch(resetDeleteCategoria())
    setTargetToDelete(target)
  }

  const handleConfirmDelete = async () => {
    if (!targetToDelete) return

    const result = await dispatch(deleteCategoria(targetToDelete.id))

    if (deleteCategoria.fulfilled.match(result) && result.payload.success) {
      setTargetToDelete(null)
      await dispatch(fetchCategorias(listQuery))
    }
  }

  return (
    <div className="p-4 lg:p-6">
      <AdminPageHeader
        title="Categorías"
        description="Organiza los productos por categorías y subcategorías"
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
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
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar categorías..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {isError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message ?? "No se pudieron cargar las categorías"}
        </div>
      )}

      {deleteError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {deleteError}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <CategoriasList
          categories={categorias}
          isLoading={isLoading}
          deletingId={deleteState.categoriaId}
          onDelete={handleDeleteRequest}
          onAddSubcategoria={handleAddSubcategoria}
        />
        {!isLoading && (
          <AdminTablePagination
            pagination={pagination}
            itemLabel="categorías"
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}
      </div>

      <CategoriasCreateModal
        open={showAddModal}
        onClose={handleCloseModal}
        defaultParentId={parentIdForSub}
      />

      <CategoriaDeleteAlertDialog
        target={targetToDelete}
        open={targetToDelete != null}
        isDeleting={deleteState.status === "loading"}
        onOpenChange={(open) => {
          if (!open) {
            setTargetToDelete(null)
            dispatch(resetDeleteCategoria())
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
