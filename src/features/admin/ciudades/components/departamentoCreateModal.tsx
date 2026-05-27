"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  createDepartment,
  resetCreateDepartment,
  selectCreateDepartment,
} from "@/store/admin/ciudades-slice"
import { AdminModal } from "@/features/admin/components"
import {
  createDepartmentSchema,
  type TCreateDepartmentForm,
} from "../const"

interface DepartamentoCreateModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (departamentoId: number) => void
}

export function DepartamentoCreateModal({
  open,
  onClose,
  onSuccess,
}: DepartamentoCreateModalProps) {
  const dispatch = useAppDispatch()
  const createState = useAppSelector(selectCreateDepartment)

  const form = useForm<TCreateDepartmentForm>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: { nombre: "" },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      dispatch(resetCreateDepartment())
    }
  }, [open, form, dispatch])

  const handleClose = () => {
    form.reset()
    dispatch(resetCreateDepartment())
    onClose()
  }

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await dispatch(createDepartment(data.nombre.trim()))

    if (createDepartment.fulfilled.match(result) && result.payload.success) {
      const newId = result.payload.data?.id
      handleClose()
      if (newId) onSuccess?.(newId)
    }
  })

  const serverError =
    createState.status === "error" ? createState.message : null

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Nuevo Departamento"
      description="Registra un departamento para asociarlo a las ciudades"
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre del departamento
          </label>
          <input
            type="text"
            {...form.register("nombre")}
            placeholder="Ej: Meta"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {form.formState.errors.nombre && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.nombre.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createState.status === "loading"}
            className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {createState.status === "loading"
              ? "Guardando..."
              : "Agregar departamento"}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
