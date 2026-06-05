"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle, Store, XCircle } from "lucide-react"
import { SignInDecorativePanel } from "@/features/auth/sign-in/components/signInDecorativePanel"
import { parseEmailVerificationFromUrl } from "@/features/auth/recovery/utils/parse-auth-url"

export function VerifyEmailTemplate() {
  const [status, setStatus] = useState<"pending" | "success" | "invalid">(
    "pending"
  )

  useEffect(() => {
    setStatus(parseEmailVerificationFromUrl())
  }, [])

  return (
    <div className="flex min-h-screen">
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
            {status === "pending" && (
              <>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Verificando correo...
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Espera un momento mientras validamos tu enlace.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Correo verificado
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tu cuenta ya está confirmada. Ya puedes iniciar sesión.
                </p>
                <Link
                  href="/sign-in"
                  className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}

            {status === "invalid" && (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                  <XCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Enlace inválido
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  El enlace de verificación expiró o no es válido. Regístrate de
                  nuevo o contacta soporte si el problema continúa.
                </p>
                <Link
                  href="/sign-in"
                  className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80"
                >
                  Volver al inicio de sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <SignInDecorativePanel />
    </div>
  )
}

export default VerifyEmailTemplate
