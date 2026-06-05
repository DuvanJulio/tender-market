import { z } from "zod"

export const profileContactSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo válido"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
})

export const profilePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Ingresa tu contraseña actual"),
    new_password: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirm_password: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  })

export type TProfileContactForm = z.infer<typeof profileContactSchema>
export type TProfilePasswordForm = z.infer<typeof profilePasswordSchema>
