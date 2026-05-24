"use client"

import Link from "next/link"
import { ArrowLeft, Store } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { TSignUpFormData } from "../const"
import type { TSignUpRole } from "../interfaces"
import type { TSignUpStep } from "../interfaces"
import type { ICityOption } from "@/features/masters"
import { SignUpBusinessStep } from "./signUpBusinessStep"
import { SignUpPersonalStep } from "./signUpPersonalStep"
import { SignUpProgressSteps } from "./signUpProgressSteps"
import { SignUpRoleSelection } from "./signUpRoleSelection"
import { SignUpServerError } from "./signUpServerError"

interface SignUpFormPanelProps {
  form: UseFormReturn<TSignUpFormData>
  step: TSignUpStep
  selectedRole: TSignUpRole
  showPassword: boolean
  showConfirmPassword: boolean
  serverError: string | null
  ciudades: ICityOption[]
  ciudadesLoading: boolean
  onSelectRole: (rol: TSignUpRole) => void
  onGoToStep: (step: TSignUpStep) => void
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
  onPersonalStepSubmit: (event: React.FormEvent) => void
  onRegisterSubmit: () => void
}

export function SignUpFormPanel({
  form,
  step,
  selectedRole,
  showPassword,
  showConfirmPassword,
  serverError,
  ciudades,
  ciudadesLoading,
  onSelectRole,
  onGoToStep,
  onTogglePassword,
  onToggleConfirmPassword,
  onPersonalStepSubmit,
  onRegisterSubmit,
}: SignUpFormPanelProps) {
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

        <SignUpProgressSteps step={step} />

        {serverError && step > 1 && <SignUpServerError message={serverError} />}

        {step === 1 && <SignUpRoleSelection onSelectRole={onSelectRole} />}

        {step === 2 && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>

            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Información personal
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedRole === "tendero"
                ? "Cuéntanos sobre ti"
                : "Datos del contacto principal"}
            </p>

            <SignUpPersonalStep
              form={form}
              role={selectedRole}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onTogglePassword={onTogglePassword}
              onToggleConfirmPassword={onToggleConfirmPassword}
              onSubmit={onPersonalStepSubmit}
            />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {"¿Ya tienes cuenta?"}{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80">
                Iniciar sesión
              </Link>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>

            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {selectedRole === "tendero" ? "Datos de tu tienda" : "Datos de tu empresa"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedRole === "tendero"
                ? "Información de tu negocio"
                : "Información de tu compañía"}
            </p>

            <SignUpBusinessStep
              form={form}
              role={selectedRole}
              ciudades={ciudades}
              ciudadesLoading={ciudadesLoading}
              onSubmit={onRegisterSubmit}
            />
          </div>
        )}
      </div>
    </div>
  )
}
