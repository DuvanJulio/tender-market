import { z } from "zod"

export const editCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().optional(),
  estado: z.enum(["active", "inactive"]),
})

export type TEditCategoriaForm = z.infer<typeof editCategoriaSchema>
