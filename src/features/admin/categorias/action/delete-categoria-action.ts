import axios from "axios"
import type { IDeleteCategoriaResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiDeleteCategoriaAction(
  categoriaId: number
): Promise<IDeleteCategoriaResponse> {
  try {
    const res = await apiClient.delete<IDeleteCategoriaResponse>(
      `/api/catalogo/categorias/${categoriaId}`
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo eliminar la categoría" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo eliminar la categoría",
      }
    }
    return { success: false, message: "No se pudo eliminar la categoría" }
  }
}
