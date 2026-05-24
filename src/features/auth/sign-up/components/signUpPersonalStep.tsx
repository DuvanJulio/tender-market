"use client"

import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { TSignUpFormData } from "../const"
import type { TSignUpRole } from "../interfaces"

interface SignUpPersonalStepProps {
  form: UseFormReturn<TSignUpFormData>
  role: TSignUpRole
  showPassword: boolean
  showConfirmPassword: boolean
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
  onSubmit: (event: React.FormEvent) => void
}

function fieldClass(hasError: boolean) {
  return `h-10 w-full rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-input focus:border-primary focus:ring-primary"
  }`
}

export function SignUpPersonalStep({
  form,
  role,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: SignUpPersonalStepProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-foreground">
            Nombre
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              id="nombre"
              {...register("nombre")}
              className={`${fieldClass(!!errors.nombre)} pl-10 pr-3`}
              placeholder="Juan"
            />
          </div>
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="apellido" className="mb-1.5 block text-sm font-medium text-foreground">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            {...register("apellido")}
            className={`${fieldClass(!!errors.apellido)} px-3`}
            placeholder="Pérez"
          />
          {errors.apellido && (
            <p className="mt-1 text-xs text-red-500">{errors.apellido.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`${fieldClass(!!errors.email)} pl-10 pr-3`}
            placeholder="juan@ejemplo.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-foreground">
          Teléfono
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="tel"
            id="telefono"
            {...register("telefono")}
            className={`${fieldClass(!!errors.telefono)} pl-10 pr-3`}
            placeholder="+57 300 123 4567"
          />
        </div>
        {errors.telefono && (
          <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            className={`${fieldClass(!!errors.password)} pl-10 pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Confirmar contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            {...register("confirmPassword")}
            className={`${fieldClass(!!errors.confirmPassword)} pl-10 pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {role === "tendero"
          ? "Cuéntanos sobre ti para continuar con los datos de tu tienda."
          : "Datos del contacto principal de tu empresa."}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}
