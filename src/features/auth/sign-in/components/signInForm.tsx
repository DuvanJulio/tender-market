"use client"

import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { TSignInFormData } from "../const"

interface SignInFormProps {
  form: UseFormReturn<TSignInFormData>
  showPassword: boolean
  onTogglePassword: () => void
  onSubmit: () => void
}

export function SignInForm({
  form,
  showPassword,
  onTogglePassword,
  onSubmit,
}: SignInFormProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
            className={`h-10 w-full rounded-lg border bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-input focus:border-primary focus:ring-primary"
            }`}
            placeholder="juan@ejemplo.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
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
            className={`h-10 w-full rounded-lg border bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-input focus:border-primary focus:ring-primary"
            }`}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            {...register("rememberMe")}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Recordarme
          </label>
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          {"¿Olvidaste tu contraseña?"}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Iniciando sesión...
          </>
        ) : (
          <>
            Iniciar sesión
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}
