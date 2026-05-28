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
import type { TDeleteCategoriaTarget } from "../interfaces"

interface CategoriaDeleteAlertDialogProps {
  target: TDeleteCategoriaTarget | null
  open: boolean
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CategoriaDeleteAlertDialog({
  target,
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: CategoriaDeleteAlertDialogProps) {
  const tipo = target?.esSubcategoria ? "subcategoría" : "categoría"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {tipo}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. &quot;{target?.nombre}&quot; será
            eliminada permanentemente.
            {!target?.esSubcategoria &&
              " Solo se pueden eliminar categorías sin subcategorías ni productos."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
