"use client"

import { Edit, Loader2, MapPin, Trash2 } from "lucide-react"
import type { TAdminCiudad } from "../interfaces"

interface CiudadCardProps {
  city: TAdminCiudad
  isDeleting?: boolean
  isEditing?: boolean
  onEdit: (city: TAdminCiudad) => void
  onDelete: (city: TAdminCiudad) => void
}

export function CiudadCard({
  city,
  isDeleting = false,
  isEditing = false,
  onEdit,
  onDelete,
}: CiudadCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              city.estado ? "bg-success/10" : "bg-warning/10"
            }`}
          >
            <MapPin
              className={`h-6 w-6 ${
                city.estado ? "text-success" : "text-warning"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{city.nombre}</h3>
            <p className="text-sm text-muted-foreground">
              {city.departamento ?? "Sin departamento"}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            city.estado
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {city.estado ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-semibold text-card-foreground">
            {city.tenderos.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Tenderos</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-card-foreground">
            {city.proveedores.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Proveedores</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onEdit(city)}
          disabled={isEditing || isDeleting}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label={`Editar ${city.nombre}`}
        >
          {isEditing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onDelete(city)}
          disabled={isDeleting || isEditing}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          aria-label={`Eliminar ${city.nombre}`}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
