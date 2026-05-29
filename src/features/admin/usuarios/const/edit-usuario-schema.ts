import { z } from "zod"

export const editUsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().optional(),
  telefono: z.string().optional(),
  negocio: z.string().min(1, "El nombre del negocio es requerido"),
})

export type TEditUsuarioForm = z.infer<typeof editUsuarioSchema>
