"use client"

import Link from "next/link"
import { ArrowRight, Building2, MapPin } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { TSignUpFormData } from "../const"
import type { TSignUpRole } from "../interfaces"
import type { ICityOption } from "@/features/masters"

interface SignUpBusinessStepProps {
  form: UseFormReturn<TSignUpFormData>
  role: TSignUpRole
  ciudades: ICityOption[]
  ciudadesLoading: boolean
  onSubmit: () => void
}

function fieldClass(hasError: boolean) {
  return `h-10 w-full rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-input focus:border-primary focus:ring-primary"
  }`
}

export function SignUpBusinessStep({
  form,
  role,
  ciudades,
  ciudadesLoading,
  onSubmit,
}: SignUpBusinessStepProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  const isTendero = role === "tendero"

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {isTendero ? (
        <div>
          <label
            htmlFor="nombre_tienda"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Nombre de la tienda
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              id="nombre_tienda"
              {...register("nombre_tienda")}
              className={`${fieldClass(!!errors.nombre_tienda)} pl-10 pr-3`}
              placeholder="Tienda Don Pepe"
            />
          </div>
          {errors.nombre_tienda && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre_tienda.message}</p>
          )}
        </div>
      ) : (
        <div>
          <label
            htmlFor="nombre_empresa"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Razón social
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              id="nombre_empresa"
              {...register("nombre_empresa")}
              className={`${fieldClass(!!errors.nombre_empresa)} pl-10 pr-3`}
              placeholder="Distribuidora XYZ S.A.S"
            />
          </div>
          {errors.nombre_empresa && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre_empresa.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="nit" className="mb-1.5 block text-sm font-medium text-foreground">
          NIT / Cédula <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          type="text"
          id="nit"
          {...register(isTendero ? "nit_tienda" : "nit_empresa")}
          className={`${fieldClass(false)} px-3`}
          placeholder="900.123.456-7"
        />
      </div>

      <div>
        <label htmlFor="ciudad_id" className="mb-1.5 block text-sm font-medium text-foreground">
          Ciudad
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            id="ciudad_id"
            {...register("ciudad_id", { valueAsNumber: true })}
            disabled={ciudadesLoading}
            className={`${fieldClass(!!errors.ciudad_id)} pl-10 pr-3 text-foreground disabled:opacity-50`}
          >
            <option value={0}>
              {ciudadesLoading ? "Cargando ciudades..." : "Seleccionar ciudad..."}
            </option>
            {ciudades.map((ciudad) => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
              </option>
            ))}
          </select>
        </div>
        {errors.ciudad_id && (
          <p className="mt-1 text-xs text-red-500">{errors.ciudad_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="direccion" className="mb-1.5 block text-sm font-medium text-foreground">
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          {...register("direccion")}
          className={`${fieldClass(!!errors.direccion)} px-3`}
          placeholder="Calle 123 # 45-67"
        />
        {errors.direccion && (
          <p className="mt-1 text-xs text-red-500">{errors.direccion.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="barrio" className="mb-1.5 block text-sm font-medium text-foreground">
          Barrio
        </label>
        <input
          type="text"
          id="barrio"
          {...register("barrio")}
          className={`${fieldClass(!!errors.barrio)} px-3`}
          placeholder="Centro"
        />
        {errors.barrio && (
          <p className="mt-1 text-xs text-red-500">{errors.barrio.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="acceptTerms"
          {...register("acceptTerms")}
          className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
        />
        <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
          Acepto los{" "}
          <Link href="#" className="text-primary hover:text-primary/80">
            términos y condiciones
          </Link>{" "}
          y la{" "}
          <Link href="#" className="text-primary hover:text-primary/80">
            política de privacidad
          </Link>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Creando cuenta...
          </>
        ) : (
          <>
            Crear cuenta
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}
