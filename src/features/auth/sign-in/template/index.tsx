"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Store, Eye, EyeOff, ArrowRight, Mail, Lock, CheckCircle } from "lucide-react"
import { SignInFormData } from "../interfaces"
import { signInAction } from "../actions"

export function SignInTemplate() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    setServerError(null)

    try {
      const response = await signInAction(data)

      if (!response.success) {
        setServerError(response.message)
        return
      }

      const rol = response.data?.rol
      switch (rol) {
        case "tendero":
          router.push("/tendero/catalogo")
          break
        case "proveedor":
          router.push("/proveedor/dashboard")
          break
        case "admin":
          router.push("/admin/dashboard")
          break
        default:
          router.push("/")
      }
    } catch {
      setServerError("Error de conexión. Intenta de nuevo.")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
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

            {/* Server Error */}
            {serverError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "El correo electrónico es obligatorio",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Ingresa un correo electrónico válido",
                      },
                    })}
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
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 8,
                        message: "La contraseña debe tener al menos 8 caracteres",
                      },
                    })}
                    className={`h-10 w-full rounded-lg border bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-input focus:border-primary focus:ring-primary"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

            {/* Demo Login Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Acceso rápido demo</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/tendero/catalogo")}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
                >
                  <Store className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Tendero</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/proveedor/dashboard")}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
                >
                  <Store className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Proveedor</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:bg-muted"
                >
                  <Store className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Admin</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {"¿No tienes cuenta?"}{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:text-primary/80">
                Registrarse
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
          <div className="flex h-full flex-col items-center justify-center p-12">
            <div className="max-w-md text-center text-primary-foreground">
              <div className="mb-6 flex justify-center">
                <Store className="h-16 w-16" />
              </div>
              <h2 className="text-3xl font-bold">
                Bienvenido de vuelta
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Accede a tu cuenta para gestionar tus pedidos, ver productos y hacer crecer tu negocio.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Acceso seguro y encriptado</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Historial de pedidos disponible</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Soporte personalizado 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
