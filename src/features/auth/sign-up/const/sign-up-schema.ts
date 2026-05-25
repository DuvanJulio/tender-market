import { z } from "zod"

export const signUpSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    apellido: z.string().min(1, "El apellido es obligatorio"),
    email: z
      .string()
      .min(1, "El correo electrónico es obligatorio")
      .email("Ingresa un correo electrónico válido"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    rol: z.enum(["tendero", "proveedor"]),
    ciudad_id: z
      .number({ error: "Selecciona una ciudad" })
      .positive("Selecciona una ciudad"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    barrio: z.string().min(1, "El barrio es obligatorio"),
    nombre_tienda: z.string().optional(),
    nit_tienda: z.string().optional(),
    nombre_empresa: z.string().optional(),
    nit_empresa: z.string().optional(),
    nombre_contacto: z.string().optional(),
    acceptTerms: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      })
    }

    if (!data.acceptTerms) {
      ctx.addIssue({
        code: "custom",
        message: "Debes aceptar los términos y condiciones",
        path: ["acceptTerms"],
      })
    }

    if (data.rol === "tendero" && !data.nombre_tienda?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "El nombre de la tienda es obligatorio",
        path: ["nombre_tienda"],
      })
    }

    if (data.rol === "proveedor" && !data.nombre_empresa?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "El nombre de la empresa es obligatorio",
        path: ["nombre_empresa"],
      })
    }
  })

export type TSignUpFormData = z.infer<typeof signUpSchema>

export const SIGN_UP_PERSONAL_FIELDS = [
  "nombre",
  "apellido",
  "email",
  "telefono",
  "password",
  "confirmPassword",
] as const satisfies readonly (keyof TSignUpFormData)[]

export const SIGN_UP_BUSINESS_FIELDS = [
  "ciudad_id",
  "direccion",
  "barrio",
  "nombre_tienda",
  "nit_tienda",
  "nombre_empresa",
  "nit_empresa",
  "acceptTerms",
] as const satisfies readonly (keyof TSignUpFormData)[]
