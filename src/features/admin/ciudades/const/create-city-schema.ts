import { z } from "zod"

export const createCitySchema = z.object({
  nombre: z.string().min(1, "El nombre de la ciudad es requerido"),
  departamento_id: z
    .number({ error: "Selecciona un departamento" })
    .positive("Selecciona un departamento"),
  estado: z.enum(["active", "pending"]),
})

export type TCreateCityForm = z.infer<typeof createCitySchema>
