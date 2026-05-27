"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  createCity,
  fetchCiudades,
  fetchDepartments,
  resetCreateCity,
  selectCreateCity,
  selectDepartments,
} from "@/store/admin/ciudades-slice"
import { AdminModal } from "@/features/admin/components"
import { createCitySchema, type TCreateCityForm } from "../const"
import { DepartamentoSearchSelect } from "./departamentoSearchSelect"

interface CiudadesCreateModalProps {
  open: boolean
  onClose: () => void
  preselectedDepartamentoId?: number | null
}

export function CiudadesCreateModal({
  open,
  onClose,
  preselectedDepartamentoId = null,
}: CiudadesCreateModalProps) {
  const dispatch = useAppDispatch()
  const departmentsState = useAppSelector(selectDepartments)
  const createState = useAppSelector(selectCreateCity)

  const form = useForm<TCreateCityForm>({
    resolver: zodResolver(createCitySchema),
    defaultValues: {
      nombre: "",
      departamento_id: 0,
      estado: "pending",
    },
  })

  useEffect(() => {
    if (open) {
      dispatch(fetchDepartments())
    } else {
      form.reset({
        nombre: "",
        departamento_id: 0,
        estado: "pending",
      })
      dispatch(resetCreateCity())
    }
  }, [open, dispatch, form])

  useEffect(() => {
    if (open && preselectedDepartamentoId) {
      form.setValue("departamento_id", preselectedDepartamentoId, {
        shouldValidate: true,
      })
    }
  }, [open, preselectedDepartamentoId, form])

  const handleClose = () => {
    form.reset()
    dispatch(resetCreateCity())
    onClose()
  }

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await dispatch(
      createCity({
        nombre: data.nombre.trim(),
        departamento_id: data.departamento_id,
        estado: data.estado === "active",
      })
    )

    if (createCity.fulfilled.match(result) && result.payload.success) {
      await dispatch(fetchCiudades())
      handleClose()
    }
  })

  const serverError = createState.status === "error" ? createState.message : null
  const departamentoId = form.watch("departamento_id")

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Nueva Ciudad"
      description="Agrega una nueva ciudad para expandir la cobertura"
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre de la ciudad
          </label>
          <input
            type="text"
            {...form.register("nombre")}
            placeholder="Ej: Villavicencio"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {form.formState.errors.nombre && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.nombre.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Departamento
          </label>
          <DepartamentoSearchSelect
            departments={departmentsState.items}
            value={departamentoId > 0 ? departamentoId : null}
            onChange={(id) =>
              form.setValue("departamento_id", id, { shouldValidate: true })
            }
            loading={departmentsState.status === "loading"}
            disabled={departmentsState.status === "error"}
            error={form.formState.errors.departamento_id?.message}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Estado inicial
          </label>
          <select
            {...form.register("estado")}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="pending">Pendiente (sin cobertura)</option>
            <option value="active">Activa (con cobertura)</option>
          </select>
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
            {createState.status === "loading" ? "Guardando..." : "Agregar ciudad"}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
