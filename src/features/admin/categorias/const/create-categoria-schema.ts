import { z } from "zod"

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().optional(),
  categoria_padre_id: z.number().nullable().optional(),
})

export type TCreateCategoriaForm = z.infer<typeof createCategoriaSchema>
