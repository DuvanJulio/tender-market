"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, Loader2, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  createProducto,
  resetSaveProducto,
  selectSaveProveedorProducto,
  updateProducto,
} from "@/store/proveedor/productos-slice"
import { AdminModal } from "@/features/admin/components"
import { apiGetCategoriasAction } from "@/features/admin/categorias/action"
import type { TCategoria } from "@/features/admin/categorias/interfaces"
import {
  proveedorProductoFormSchema,
  type TProveedorProductoForm,
} from "../const"
import { apiUploadProductoImagenAction } from "../action"
import type { TProveedorProducto } from "../interfaces"

type TCategoriaOption = { id: number; label: string }

function flattenCategorias(categorias: TCategoria[]): TCategoriaOption[] {
  const options: TCategoriaOption[] = []

  for (const parent of categorias) {
    options.push({ id: parent.id, label: parent.nombre })
    for (const sub of parent.subcategorias) {
      options.push({
        id: sub.id,
        label: `${parent.nombre} › ${sub.nombre}`,
      })
    }
  }

  return options
}

interface ProductoFormModalProps {
  open: boolean
  onClose: () => void
  producto?: TProveedorProducto | null
  onSaved: () => void
}

export function ProductoFormModal({
  open,
  onClose,
  producto,
  onSaved,
}: ProductoFormModalProps) {
  const dispatch = useAppDispatch()
  const saveState = useAppSelector(selectSaveProveedorProducto)
  const [categoriaOptions, setCategoriaOptions] = useState<TCategoriaOption[]>([])
  const [loadingCategorias, setLoadingCategorias] = useState(false)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [uploadingImagen, setUploadingImagen] = useState(false)
  const [imagenError, setImagenError] = useState<string | null>(null)

  const isEditing = producto != null

  const form = useForm<TProveedorProductoForm>({
    resolver: zodResolver(proveedorProductoFormSchema),
    defaultValues: {
      nombre: "",
      categoria_id: 0,
      precio_mayorista: 0,
      stock: 0,
      imagen_url: "",
    },
  })

  useEffect(() => {
    if (!open) return

    dispatch(resetSaveProducto())
    form.reset({
      nombre: producto?.nombre ?? "",
      categoria_id: producto?.categoria_id ?? 0,
      precio_mayorista: producto?.precio ?? 0,
      stock: producto?.stock ?? 0,
      imagen_url: producto?.imagen_url ?? "",
    })
    setImagenPreview(producto?.imagen_url ?? null)
    setImagenError(null)

    setLoadingCategorias(true)
    apiGetCategoriasAction({ page: 1, pageSize: 50 })
      .then((res) => {
        if (res.success && res.data?.items) {
          setCategoriaOptions(flattenCategorias(res.data.items))
        }
      })
      .finally(() => setLoadingCategorias(false))
  }, [open, producto, dispatch, form])

  const handleClose = () => {
    form.reset()
    setImagenPreview(null)
    setImagenError(null)
    dispatch(resetSaveProducto())
    onClose()
  }

  async function handleImagenChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    setImagenError(null)
    setUploadingImagen(true)

    const result = await apiUploadProductoImagenAction(file)

    setUploadingImagen(false)

    if (!result.success || !result.data?.url) {
      setImagenError(result.message ?? "No se pudo subir la imagen")
      return
    }

    form.setValue("imagen_url", result.data.url, { shouldDirty: true })
    setImagenPreview(result.data.url)
  }

  function handleRemoveImagen() {
    form.setValue("imagen_url", "", { shouldDirty: true })
    setImagenPreview(null)
    setImagenError(null)
  }

  const onSubmit = form.handleSubmit(async (data) => {
    const body = {
      nombre: data.nombre.trim(),
      categoria_id: data.categoria_id,
      precio_mayorista: data.precio_mayorista,
      stock: data.stock,
      imagen_url: data.imagen_url?.trim() || null,
    }

    if (isEditing && producto) {
      const result = await dispatch(
        updateProducto({ productoId: producto.id, body })
      )
      if (updateProducto.fulfilled.match(result) && result.payload.success) {
        onSaved()
        handleClose()
      }
      return
    }

    const result = await dispatch(createProducto(body))
    if (createProducto.fulfilled.match(result) && result.payload.success) {
      onSaved()
      handleClose()
    }
  })

  const isSaving = saveState.status === "loading"
  const title = isEditing ? "Editar producto" : "Nuevo producto"
  const description = isEditing
    ? "Actualiza la información de tu producto"
    : "El producto quedará en revisión hasta que el admin lo publique"

  const categoriaSelectOptions = useMemo(
    () => categoriaOptions,
    [categoriaOptions]
  )

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={title}
      description={description}
      size="lg"
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {saveState.status === "error" && saveState.message ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {saveState.message}
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Nombre
          </label>
          <input
            {...form.register("nombre")}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {form.formState.errors.nombre ? (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.nombre.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Categoría
          </label>
          <select
            {...form.register("categoria_id", { valueAsNumber: true })}
            disabled={loadingCategorias}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={0}>Seleccionar categoría</option>
            {categoriaSelectOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          {form.formState.errors.categoria_id ? (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.categoria_id.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Precio mayorista (COP)
            </label>
            <input
              type="number"
              min={1}
              {...form.register("precio_mayorista", { valueAsNumber: true })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {form.formState.errors.precio_mayorista ? (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.precio_mayorista.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Stock
            </label>
            <input
              type="number"
              min={0}
              {...form.register("stock", { valueAsNumber: true })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {form.formState.errors.stock ? (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.stock.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Imagen del producto (opcional)
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40">
              {imagenPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                {uploadingImagen ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" />
                    Elegir imagen
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploadingImagen || isSaving}
                  onChange={handleImagenChange}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP o GIF. Máximo 5 MB.
              </p>
              {imagenPreview ? (
                <button
                  type="button"
                  onClick={handleRemoveImagen}
                  disabled={uploadingImagen || isSaving}
                  className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                >
                  <X className="h-3 w-3" />
                  Quitar imagen
                </button>
              ) : null}
            </div>
          </div>
          {imagenError ? (
            <p className="mt-1 text-xs text-destructive">{imagenError}</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving || uploadingImagen}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear producto"
            )}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
