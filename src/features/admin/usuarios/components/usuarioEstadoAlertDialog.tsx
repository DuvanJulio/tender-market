"use client"

import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { USUARIO_ESTADO_ACCION_CONFIG } from "../const"
import type { TUsuarioEstadoAccion } from "../const/usuario-estado-actions"
import type { TAdminUsuario } from "../interfaces"

interface UsuarioEstadoAlertDialogProps {
  user: TAdminUsuario | null
  accion: TUsuarioEstadoAccion | null
  open: boolean
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function UsuarioEstadoAlertDialog({
  user,
  accion,
  open,
  isLoading,
  onOpenChange,
  onConfirm,
}: UsuarioEstadoAlertDialogProps) {
  const config = accion ? USUARIO_ESTADO_ACCION_CONFIG[accion] : null

  if (!config || !user || !accion) return null

  const isDestructive = accion === "rechazar"
  const isWarning = accion === "desactivar"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {config.dialogDescription(user.nombre)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "default"}
            className={
              isWarning
                ? "bg-warning text-warning-foreground hover:bg-warning/90"
                : !isDestructive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : undefined
            }
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Procesando...
              </>
            ) : (
              config.confirmLabel
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
