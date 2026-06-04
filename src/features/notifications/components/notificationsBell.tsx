"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchNotificaciones,
  markAllNotificacionesLeidas,
  markNotificacionLeida,
  selectNotificationsView,
} from "@/store/notifications-slice"
import type { TNotificacionesScope } from "../interfaces"
import {
  formatNotificationTime,
  getNotificationOrdersHref,
  getNotificationsFooterHref,
  getNotificationsFooterLabel,
} from "../utils"

type NotificationsBellProps = {
  scope: TNotificacionesScope
  buttonClassName?: string
  iconClassName?: string
}

export function NotificationsBell({
  scope,
  buttonClassName = "relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
  iconClassName = "h-4 w-4",
}: NotificationsBellProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { status, message, notificaciones, noLeidas } = useAppSelector(
    selectNotificationsView
  )
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchNotificaciones(scope))
    const interval = setInterval(() => {
      dispatch(fetchNotificaciones(scope))
    }, 60_000)
    return () => clearInterval(interval)
  }, [dispatch, scope])

  useEffect(() => {
    if (open) {
      dispatch(fetchNotificaciones(scope))
    }
  }, [open, dispatch, scope])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const handleOpen = () => setOpen((prev) => !prev)

  const handleMarkAll = () => {
    dispatch(markAllNotificacionesLeidas(scope))
  }

  const handleNotificationClick = (id: number, tipo: string, leida: boolean) => {
    if (!leida) {
      dispatch(markNotificacionLeida({ scope, id }))
    }
    setOpen(false)
    router.push(getNotificationOrdersHref(scope, tipo))
  }

  const footerHref = getNotificationsFooterHref(scope)
  const footerLabel = getNotificationsFooterLabel(scope)

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleOpen}
        className={buttonClassName}
        aria-label="Notificaciones"
        aria-expanded={open}
      >
        <Bell className={iconClassName} />
        {noLeidas > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-semibold text-foreground">Notificaciones</h3>
            {noLeidas > 0 ? (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-xs font-medium text-primary hover:text-primary/80"
              >
                Marcar todas
              </button>
            ) : (
              <Link
                href={footerHref}
                className="text-xs text-primary hover:text-primary/80"
                onClick={() => setOpen(false)}
              >
                {footerLabel}
              </Link>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {status === "loading" && notificaciones.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : null}

            {status !== "loading" && notificaciones.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
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
                  handleNotificationClick(
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
        </div>
      ) : null}
    </div>
  )
}
