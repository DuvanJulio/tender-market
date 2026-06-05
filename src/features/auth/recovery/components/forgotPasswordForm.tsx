"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Store } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { TForgotPasswordFormData } from "../const"
import { SignInServerError } from "@/features/auth/sign-in/components/signInServerError"

interface ForgotPasswordFormProps {
  form: UseFormReturn<TForgotPasswordFormData>
  serverMessage: string | null
  isSuccess: boolean
  onSubmit: () => void
}

export function ForgotPasswordForm({
  form,
  serverMessage,
  isSuccess,
  onSubmit,
}: ForgotPasswordFormProps) {
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
          <Link
            href="/sign-in"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {serverMessage && !isSuccess && (
            <SignInServerError message={serverMessage} />
          )}

          {isSuccess ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {serverMessage}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
