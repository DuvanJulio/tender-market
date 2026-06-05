"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, KeyRound, Loader2, Mail, Phone, Save } from "lucide-react"
import { toast } from "sonner"
import {
  profileContactSchema,
  profilePasswordSchema,
  type TProfileContactForm,
  type TProfilePasswordForm,
} from "../const/profile-edit-schema"
import { patchPasswordAction, patchProfileAction } from "../action/profile-action"
import type { TUserProfile } from "../utils/map-user-profile"

type AccountProfileEditFormProps = {
  profile: TUserProfile
  onProfileUpdated: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

export function AccountProfileEditForm({
  profile,
  onProfileUpdated,
}: AccountProfileEditFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const contactForm = useForm<TProfileContactForm>({
    resolver: zodResolver(profileContactSchema),
    defaultValues: {
      email: profile.email,
      telefono: profile.telefono === "—" ? "" : profile.telefono,
    },
  })

  const passwordForm = useForm<TProfilePasswordForm>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  useEffect(() => {
    contactForm.reset({
      email: profile.email,
      telefono: profile.telefono === "—" ? "" : profile.telefono,
    })
  }, [profile.email, profile.telefono, contactForm])

  const onSubmitContact = contactForm.handleSubmit(async (data) => {
    setSavingContact(true)
    const result = await patchProfileAction(data)
    setSavingContact(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    onProfileUpdated()
  })

  const onSubmitPassword = passwordForm.handleSubmit(async (data) => {
    setSavingPassword(true)
    const result = await patchPasswordAction({
      current_password: data.current_password,
      new_password: data.new_password,
    })
    setSavingPassword(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    passwordForm.reset()
  })

  const inputClass = (hasError: boolean) =>
    `h-10 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-1 ${
      hasError
        ? "border-destructive focus:border-destructive focus:ring-destructive"
        : "border-input focus:border-primary focus:ring-primary"
    }`

  return (
    <div className="mt-8 space-y-6">
      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Editar contacto
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza tu correo y teléfono personal
          </p>
        </div>

        <form onSubmit={onSubmitContact} className="space-y-4">
          <div>
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="profile-email"
                type="email"
                {...contactForm.register("email")}
                className={`${inputClass(!!contactForm.formState.errors.email)} pl-10`}
              />
            </div>
            <FieldError message={contactForm.formState.errors.email?.message} />
          </div>

          <div>
            <label
              htmlFor="profile-telefono"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="profile-telefono"
                type="tel"
                placeholder="300 123 4567"
                {...contactForm.register("telefono")}
                className={`${inputClass(!!contactForm.formState.errors.telefono)} pl-10`}
              />
            </div>
            <FieldError message={contactForm.formState.errors.telefono?.message} />
          </div>

          <button
            type="submit"
            disabled={savingContact}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {savingContact ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar cambios
          </button>
        </form>
      </article>

      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <KeyRound className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Cambiar contraseña
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Usa una contraseña segura de al menos 8 caracteres
            </p>
          </div>
        </div>

        <form onSubmit={onSubmitPassword} className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Contraseña actual
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                {...passwordForm.register("current_password")}
                className={`${inputClass(!!passwordForm.formState.errors.current_password)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError
              message={passwordForm.formState.errors.current_password?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  {...passwordForm.register("new_password")}
                  className={`${inputClass(!!passwordForm.formState.errors.new_password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError
                message={passwordForm.formState.errors.new_password?.message}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...passwordForm.register("confirm_password")}
                  className={`${inputClass(!!passwordForm.formState.errors.confirm_password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError
                message={passwordForm.formState.errors.confirm_password?.message}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {savingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Actualizar contraseña
          </button>
        </form>
      </article>
    </div>
  )
}
