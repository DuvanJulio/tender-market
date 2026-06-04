"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchCategorias,
  resetUpdateCategoria,
  selectCategoriasQuery,
  selectUpdateCategoria,
  updateCategoria,
} from "@/store/admin/categorias-slice"
import { AdminModal } from "@/features/admin/components"
import { editCategoriaSchema, type TEditCategoriaForm } from "../const"
import type { TEditCategoriaTarget } from "../interfaces"

function slugifyNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface CategoriasEditModalProps {
  open: boolean
  target: TEditCategoriaTarget | null
  onClose: () => void
}

export function CategoriasEditModal({
  open,
  target,
  onClose,
}: CategoriasEditModalProps) {
  const dispatch = useAppDispatch()
  const listQuery = useAppSelector(selectCategoriasQuery)
  const updateState = useAppSelector(selectUpdateCategoria)

  const form = useForm<TEditCategoriaForm>({
    resolver: zodResolver(editCategoriaSchema),
    defaultValues: {
      nombre: "",
      slug: "",
      estado: "active",
    },
  })

  const isSubcategoria = target?.esSubcategoria ?? false

  useEffect(() => {
    if (!open || !target) return

    dispatch(resetUpdateCategoria())
    form.reset({
      nombre: target.nombre,
      slug: target.slug,
      estado: target.estado ? "active" : "inactive",
    })
  }, [open, target, dispatch, form])

  const handleClose = () => {
    form.reset()
    dispatch(resetUpdateCategoria())
    onClose()
  }

  const nombre = form.watch("nombre")

  useEffect(() => {
    if (!isSubcategoria && !form.formState.dirtyFields.slug && nombre) {
      form.setValue("slug", slugifyNombre(nombre), { shouldValidate: false })
    }
  }, [nombre, isSubcategoria, form])

  const onSubmit = form.handleSubmit(async (data) => {
    if (!target) return

    const body = {
      nombre: data.nombre.trim(),
      estado: data.estado === "active",
      ...(isSubcategoria
        ? {}
        : {
            slug: (data.slug?.trim() || slugifyNombre(data.nombre)).toLowerCase(),
          }),
    }

    const result = await dispatch(
      updateCategoria({ categoriaId: target.id, body })
    )

    if (updateCategoria.fulfilled.match(result) && result.payload.success) {
      await dispatch(fetchCategorias(listQuery))
      handleClose()
    }
  })

  const serverError =
    updateState.status === "error" ? updateState.message : null
  const isSubmitting = updateState.status === "loading"

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={isSubcategoria ? "Editar subcategoría" : "Editar categoría"}
      description={
        target
          ? `Actualiza los datos de ${target.nombre}`
          : "Actualiza los datos de la categoría"
      }
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...form.register("nombre")}
          />
          {form.formState.errors.nombre && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.nombre.message}
            </p>
          )}
        </div>

        {!isSubcategoria && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Slug (URL)
            </label>
            <input
              type="text"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...form.register("slug")}
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Estado
          </label>
          <select
            {...form.register("estado")}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
