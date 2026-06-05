"use client"

import Link from "next/link"
import { Store } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { TSignInFormData } from "../const"
import { SignInForm } from "./signInForm"
import { SignInInfoBanner } from "./signInInfoBanner"
import { SignInServerError } from "./signInServerError"

interface SignInFormPanelProps {
  form: UseFormReturn<TSignInFormData>
  showPassword: boolean
  serverError: string | null
  infoMessage: string | null
  onTogglePassword: () => void
  onSubmit: () => void
}

export function SignInFormPanel({
  form,
  showPassword,
  serverError,
  infoMessage,
  onTogglePassword,
  onSubmit,
}: SignInFormPanelProps) {
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
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa a tu cuenta para continuar
          </p>

          {infoMessage && <SignInInfoBanner message={infoMessage} />}

          {serverError && <SignInServerError message={serverError} />}

          <SignInForm
            form={form}
            showPassword={showPassword}
            onTogglePassword={onTogglePassword}
            onSubmit={onSubmit}
          />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {"¿No tienes cuenta?"}{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
