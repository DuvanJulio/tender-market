"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchNotificaciones,
  markAllNotificacionesLeidas,
  markNotificacionLeida,
  selectNotificationsView,
} from "@/store/notifications-slice"
import type { TNotificacionesScope } from "@/features/notifications/interfaces"
import {
  formatNotificationTime,
  getNotificationOrdersHref,
} from "@/features/notifications/utils"

type AccountNotificationsViewProps = {
  scope: TNotificacionesScope
  backHref: string
}

export function AccountNotificationsView({
  scope,
  backHref,
}: AccountNotificationsViewProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { status, message, notificaciones, noLeidas } = useAppSelector(
    selectNotificationsView
  )

  useEffect(() => {
    dispatch(fetchNotificaciones(scope))
  }, [dispatch, scope])

  const handleMarkAll = () => {
    dispatch(markAllNotificacionesLeidas(scope))
  }

  const handleClick = (id: number, tipo: string, leida: boolean) => {
    if (!leida) {
      dispatch(markNotificacionLeida({ scope, id }))
    }
    router.push(getNotificationOrdersHref(scope, tipo))
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {noLeidas > 0
              ? `${noLeidas} sin leer`
              : "Estás al día con tus avisos"}
          </p>
        </div>
        {noLeidas > 0 ? (
          <button
            type="button"
            onClick={handleMarkAll}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Marcar todas como leídas
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {status === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}

        {status !== "loading" && notificaciones.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {status === "error" && message
              ? message
              : "No tienes notificaciones"}
          </p>
        ) : null}

        {notificaciones.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() =>
              handleClick(
                notification.id,
                notification.tipo,
                notification.leida
              )
            }
            className={`flex w-full items-start gap-3 border-b border-border p-4 text-left last:border-0 transition-colors hover:bg-muted/50 ${
              !notification.leida ? "bg-primary/5" : ""
            }`}
          >
            <div
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                notification.leida ? "bg-transparent" : "bg-primary"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {notification.titulo}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {notification.mensaje}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatNotificationTime(notification.created_at)}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href={backHref} className="text-primary hover:text-primary/80">
          Volver al panel
        </Link>
      </p>
    </div>
  )
}
