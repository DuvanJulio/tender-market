"use client"

import { ChevronDown, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getUsuarioEstadoOpciones,
  USUARIO_ESTADO_ACCION_CONFIG,
  USUARIO_STATUS_CONFIG,
} from "../const"
import type { TUsuarioEstadoAccion } from "../const/usuario-estado-actions"
import type { TAdminUsuario } from "../interfaces"

interface UsuarioEstadoMenuProps {
  user: TAdminUsuario
  isUpdating: boolean
  onSelectAccion: (user: TAdminUsuario, accion: TUsuarioEstadoAccion) => void
}

export function UsuarioEstadoMenu({
  user,
  isUpdating,
  onSelectAccion,
}: UsuarioEstadoMenuProps) {
  const statusConfig = USUARIO_STATUS_CONFIG[user.estado]
  const opciones = getUsuarioEstadoOpciones(user.estado)

  if (opciones.length === 0) {
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.color}`}
      >
        {statusConfig.label}
      </span>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isUpdating}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 ${statusConfig.color}`}
          aria-label={`Cambiar estado de ${user.nombre}`}
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              {statusConfig.label}
              <ChevronDown className="h-3 w-3 opacity-70" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Cambiar estado
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {opciones.map((accion) => {
          const config = USUARIO_ESTADO_ACCION_CONFIG[accion]
          return (
            <DropdownMenuItem
              key={accion}
              className={`cursor-pointer ${config.itemClassName}`}
              onSelect={() => onSelectAccion(user, accion)}
            >
              {config.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
