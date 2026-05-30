import { z } from "zod"

export const proveedorProductoFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  categoria_id: z.number().int().positive("Selecciona una categoría"),
  precio_mayorista: z.number().positive("El precio debe ser mayor a cero"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  imagen_url: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "URL no válida"
    ),
})

export type TProveedorProductoForm = z.infer<typeof proveedorProductoFormSchema>
