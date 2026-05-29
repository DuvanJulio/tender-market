"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchUsuarios,
  resetUpdateUsuario,
  selectUpdateUsuario,
  updateUsuario,
} from "@/store/admin/usuarios-slice"
import { AdminModal } from "@/features/admin/components"
import { editUsuarioSchema, type TEditUsuarioForm } from "../const"
import type { TAdminUsuario } from "../interfaces"

interface UsuarioEditModalProps {
  user: TAdminUsuario | null
  open: boolean
  onClose: () => void
}

export function UsuarioEditModal({ user, open, onClose }: UsuarioEditModalProps) {
  const dispatch = useAppDispatch()
  const updateState = useAppSelector(selectUpdateUsuario)

  const form = useForm<TEditUsuarioForm>({
    resolver: zodResolver(editUsuarioSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      negocio: "",
    },
  })

  useEffect(() => {
    if (open && user) {
      form.reset({
        nombre: user.nombre_pila || user.nombre.split(" ")[0] || "",
        apellido: user.apellido ?? "",
        telefono: user.telefono ?? "",
        negocio: user.negocio === "—" ? "" : user.negocio,
      })
      dispatch(resetUpdateUsuario())
    }
  }, [open, user, dispatch, form])

  const handleClose = () => {
    form.reset()
    dispatch(resetUpdateUsuario())
    onClose()
  }

  const onSubmit = form.handleSubmit(async (data) => {
    if (!user) return

    const result = await dispatch(
      updateUsuario({
        usuarioId: user.id,
        body: {
          nombre: data.nombre.trim(),
          apellido: data.apellido?.trim() || "",
          telefono: data.telefono?.trim() || "",
          negocio: data.negocio.trim(),
        },
      })
    )

    if (updateUsuario.fulfilled.match(result) && result.payload.success) {
      await dispatch(fetchUsuarios())
      handleClose()
    }
  })

  if (!user) return null

  const serverError =
    updateState.status === "error" ? updateState.message : null
  const isSubmitting = updateState.status === "loading"
  const negocioLabel =
    user.rol === "tendero" ? "Nombre de la tienda" : "Nombre de la empresa"

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Editar usuario"
      description={`Actualiza los datos de ${user.nombre}`}
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Apellido
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...form.register("apellido")}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Teléfono
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...form.register("telefono")}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {negocioLabel}
          </label>
          <input
            type="text"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...form.register("negocio")}
          />
          {form.formState.errors.negocio && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.negocio.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
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
