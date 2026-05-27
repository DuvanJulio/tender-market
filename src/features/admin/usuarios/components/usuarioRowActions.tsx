"use client"

import Link from "next/link"
import {
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { TUsuario } from "../const"

interface UsuarioRowActionsProps {
  user: TUsuario
}

export function UsuarioRowActions({ user }: UsuarioRowActionsProps) {
  const canDeactivate =
    user.status === "active" || user.status === "verified"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menú de acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/usuarios/${user.id}`}
            className="cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            Ver detalles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/usuarios/${user.id}/editar`}
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        {canDeactivate ? (
          <DropdownMenuItem
            className="cursor-pointer text-warning focus:text-warning"
          >
            <UserX className="h-4 w-4" />
            Desactivar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer text-success focus:text-success"
          >
            <UserCheck className="h-4 w-4" />
            Activar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
