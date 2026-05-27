import { z } from "zod"

export const createDepartmentSchema = z.object({
  nombre: z.string().min(1, "El nombre del departamento es requerido"),
})

export type TCreateDepartmentForm = z.infer<typeof createDepartmentSchema>
