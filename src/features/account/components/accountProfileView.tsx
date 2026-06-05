"use client"

import {
  Building2,
  Loader2,
  MapPin,
  User,
} from "lucide-react"
import { useAppDispatch } from "@/store"
import { fetchShopmanUser } from "@/store/shopman/user-slice"
import type { TUserProfile } from "../utils/map-user-profile"
import { AccountProfileEditForm } from "./accountProfileEditForm"

type AccountProfileViewProps = {
  profile: TUserProfile | null
  status: "idle" | "loading" | "success" | "error"
  message?: string
  title?: string
  description?: string
}

function ProfileSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof User
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <dl className="divide-y divide-border rounded-xl bg-muted/30">
        {children}
      </dl>
    </section>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return null

  return (
    <div className="flex flex-col gap-0.5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground sm:text-right">
        {value}
      </dd>
    </div>
  )
}

export function AccountProfileView({
  profile,
  status,
  message,
}: AccountProfileViewProps) {
  const dispatch = useAppDispatch()

  const handleProfileUpdated = () => {
    dispatch(fetchShopmanUser())
  }
  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "error" || !profile) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          {message ?? "No se pudo cargar tu perfil"}
        </p>
      </div>
    )
  }

  const fullName = [profile.nombre, profile.apellido].filter(Boolean).join(" ")
  const isProveedor = profile.rol === "proveedor"
  const negocioLabel = isProveedor ? "Empresa" : "Tienda"
  const rolLabel = isProveedor ? "Proveedor" : "Tendero"

  const addressParts = [profile.direccion, profile.barrio, profile.ciudad].filter(
    (part) => part && part !== "—"
  )
  const fullAddress =
    addressParts.length > 0 ? addressParts.join(", ") : undefined

  return (
    <div className="mx-auto max-w-2xl">
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/8 to-transparent px-6 pb-16 pt-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-background text-2xl font-semibold text-primary shadow-md ring-4 ring-background">
              {profile.initials}
            </div>
            <div className="min-w-0 pb-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {fullName}
              </h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
              <span className="mt-3 inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                {rolLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8 px-6 pb-8 pt-2 sm:px-8">
          <ProfileSection title={negocioLabel} icon={Building2}>
            <ProfileRow label={`Nombre de la ${negocioLabel.toLowerCase()}`} value={profile.negocio} />
            <ProfileRow label="Teléfono comercial" value={profile.telefonoNegocio} />
            {profile.nit ? (
              <ProfileRow label="NIT" value={profile.nit} />
            ) : null}
            {profile.nombreContacto ? (
              <ProfileRow label="Persona de contacto" value={profile.nombreContacto} />
            ) : null}
          </ProfileSection>

          {fullAddress ? (
            <ProfileSection title="Ubicación" icon={MapPin}>
              <div className="px-4 py-3.5">
                <p className="text-sm leading-relaxed text-foreground">
                  {fullAddress}
                </p>
              </div>
            </ProfileSection>
          ) : null}
        </div>
      </article>

      <AccountProfileEditForm
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  )
}
