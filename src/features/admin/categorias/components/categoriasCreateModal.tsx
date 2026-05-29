"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  createCategoria,
  fetchCategorias,
  selectCategoriasQuery,
  resetCreateCategoria,
  selectCategoriasListView,
  selectCreateCategoria,
} from "@/store/admin/categorias-slice"
import { AdminModal } from "@/features/admin/components"
import { createCategoriaSchema, type TCreateCategoriaForm } from "../const"

function slugifyNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface CategoriasCreateModalProps {
  open: boolean
  onClose: () => void
  defaultParentId?: number | null
}

export function CategoriasCreateModal({
  open,
  onClose,
  defaultParentId = null,
}: CategoriasCreateModalProps) {
  const dispatch = useAppDispatch()
  const { categorias } = useAppSelector(selectCategoriasListView)
  const listQuery = useAppSelector(selectCategoriasQuery)
  const createState = useAppSelector(selectCreateCategoria)

  const form = useForm<TCreateCategoriaForm>({
    resolver: zodResolver(createCategoriaSchema),
    defaultValues: {
      nombre: "",
      slug: "",
      categoria_padre_id: null,
    },
  })

  const isSubcategoria = defaultParentId != null
  const title = isSubcategoria ? "Nueva Subcategoría" : "Nueva Categoría"
  const description = isSubcategoria
    ? "Agrega una subcategoría dentro de la categoría seleccionada"
    : "Agrega una nueva categoría para organizar productos"

  useEffect(() => {
    if (open) {
      form.reset({
        nombre: "",
        slug: "",
        categoria_padre_id: defaultParentId,
      })
      dispatch(resetCreateCategoria())
    }
  }, [open, defaultParentId, dispatch, form])

  const handleClose = () => {
    form.reset()
    dispatch(resetCreateCategoria())
    onClose()
  }

  const nombre = form.watch("nombre")

  useEffect(() => {
    if (!form.formState.dirtyFields.slug && nombre) {
      form.setValue("slug", slugifyNombre(nombre), { shouldValidate: false })
    }
  }, [nombre, form])

  const onSubmit = form.handleSubmit(async (data) => {
    const slug = (data.slug?.trim() || slugifyNombre(data.nombre)).toLowerCase()
    const parentId = data.categoria_padre_id ?? null

    const result = await dispatch(
      createCategoria({
        nombre: data.nombre.trim(),
        slug: slug || undefined,
        categoria_padre_id: parentId,
      })
    )

    if (createCategoria.fulfilled.match(result) && result.payload.success) {
      await dispatch(fetchCategorias(listQuery))
      handleClose()
    }
  })

  const serverError =
    createState.status === "error" ? createState.message : null
  const isSubmitting = createState.status === "loading"

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={title}
      description={description}
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre {isSubcategoria ? "de la subcategoría" : "de la categoría"}
          </label>
          <input
            type="text"
            placeholder={
              isSubcategoria ? "Ej: Jabones" : "Ej: Snacks y Confitería"
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
              placeholder="snacks-confiteria"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...form.register("slug")}
            />
          </div>
        )}

        {!isSubcategoria && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Categoría padre (opcional)
            </label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={form.watch("categoria_padre_id") ?? ""}
              onChange={(e) => {
                const value = e.target.value
                form.setValue(
                  "categoria_padre_id",
                  value ? Number(value) : null,
                  { shouldValidate: true }
                )
              }}
            >
              <option value="">Ninguna (categoría principal)</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

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
            {isSubmitting ? "Guardando..." : "Crear categoría"}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
