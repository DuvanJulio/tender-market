"use client"

import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Lock, Store } from "lucide-react"
import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { TResetPasswordFormData } from "../const"
import { SignInServerError } from "@/features/auth/sign-in/components/signInServerError"

interface ResetPasswordFormProps {
  form: UseFormReturn<TResetPasswordFormData>
  serverMessage: string | null
  isSuccess: boolean
  tokenReady: boolean
  onSubmit: () => void
}

export function ResetPasswordForm({
  form,
  serverMessage,
  isSuccess,
  tokenReady,
  onSubmit,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    formState: { errors, isSubmitting },
  } = form

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TenderMarket</span>
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Nueva contraseña
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Elige una contraseña segura para tu cuenta.
          </p>

          {!tokenReady && !isSuccess && (
            <SignInServerError message="El enlace no es válido o expiró. Solicita uno nuevo." />
          )}

          {serverMessage && !isSuccess && tokenReady && (
            <SignInServerError message={serverMessage} />
          )}

          {isSuccess ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {serverMessage}
              </div>
              <Link
                href="/sign-in"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Iniciar sesión
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : tokenReady ? (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Nueva contraseña
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
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                    className={`h-10 w-full rounded-lg border bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-input focus:border-primary focus:ring-primary"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
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
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Actualizar contraseña"}
              </button>
            </form>
          ) : (
            <Link
              href="/forgot-password"
              className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80"
            >
              Solicitar nuevo enlace
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
