"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { AdminModal } from "@/features/admin/components"
import { apiGetUsuarioDetalleAction } from "../action"
import {
  USUARIO_ROLE_CONFIG,
  USUARIO_STATUS_CONFIG,
} from "../const"
import type { TAdminUsuarioDetalle } from "../interfaces"

function formatDateTime(iso: string | null) {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value?.trim() || "—"}</dd>
    </div>
  )
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
        {children}
      </div>
    </div>
  )
}

interface UsuarioDetailModalProps {
  usuarioId: string | null
  open: boolean
  onClose: () => void
}

export function UsuarioDetailModal({
  usuarioId,
  open,
  onClose,
}: UsuarioDetailModalProps) {
  const [detail, setDetail] = useState<TAdminUsuarioDetalle | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !usuarioId) {
      setDetail(null)
      setError(null)
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      const result = await apiGetUsuarioDetalleAction(usuarioId!)

      if (cancelled) return

      if (!result.success || !result.data) {
        setDetail(null)
        setError(result.message ?? "No se pudo cargar el detalle")
      } else {
        setDetail(result.data)
      }
      setIsLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [open, usuarioId])

  const role = detail ? USUARIO_ROLE_CONFIG[detail.rol] : null
  const status = detail ? USUARIO_STATUS_CONFIG[detail.estado] : null
  const RoleIcon = role?.icon

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      size="lg"
      title="Detalles del usuario"
      description="Información del registro (la contraseña no se almacena ni se muestra)"
    >
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && !isLoading && (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {detail && !isLoading && role && status && RoleIcon && (
        <div className="mt-6 space-y-5 text-sm">
          <DetailSection title="Datos personales">
            <DetailRow label="Nombre" value={detail.nombre_pila} />
            <DetailRow label="Apellido" value={detail.apellido} />
            <DetailRow label="Correo electrónico" value={detail.email} />
            <DetailRow label="Teléfono personal" value={detail.telefono} />
          </DetailSection>

          <DetailSection title="Negocio">
            <div>
              <dt className="text-muted-foreground">Rol</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${role.color}`}
                >
                  <RoleIcon className="h-3.5 w-3.5" />
                  {role.label}
                </span>
              </dd>
            </div>
            {detail.rol === "tendero" ? (
              <DetailRow label="Nombre de la tienda" value={detail.nombre_tienda} />
            ) : (
              <>
                <DetailRow
                  label="Nombre de la empresa"
                  value={detail.nombre_empresa}
                />
                <DetailRow
                  label="Nombre de contacto"
                  value={detail.nombre_contacto}
                />
              </>
            )}
            <DetailRow label="NIT / Cédula" value={detail.nit} />
            <DetailRow
              label="Teléfono del negocio"
              value={detail.telefono_negocio}
            />
          </DetailSection>

          <DetailSection title="Ubicación">
            <DetailRow label="Dirección" value={detail.direccion} />
            <DetailRow label="Barrio" value={detail.barrio} />
            <DetailRow label="Ciudad" value={detail.ciudad} />
            <DetailRow label="Departamento" value={detail.departamento} />
          </DetailSection>

          <DetailSection title="Cuenta">
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="mt-1 space-y-1">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                >
                  {status.label}
                </span>
                <p className="text-xs text-muted-foreground">
                  {status.description}
                </p>
              </dd>
            </div>
            <DetailRow
              label="Fecha de registro"
              value={formatDateTime(detail.fecha_registro)}
            />
            <DetailRow
              label="Última actualización"
              value={formatDateTime(detail.fecha_actualizacion)}
            />
            <DetailRow
              label="Último acceso"
              value={formatDateTime(detail.ultimo_acceso)}
            />
          </DetailSection>

          <DetailSection title="Actividad en la plataforma">
            <DetailRow label="Pedidos" value={String(detail.pedidos)} />
            <DetailRow
              label="Total movido"
              value={formatPrice(detail.total_gastado)}
            />
          </DetailSection>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Cerrar
        </button>
      </div>
    </AdminModal>
  )
}
