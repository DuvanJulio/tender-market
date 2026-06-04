import axios from "axios"
import type {
  IPatchCategoriaResponse,
  TPatchCategoriaBody,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

export async function apiPatchCategoriaAction(
  categoriaId: number,
  body: TPatchCategoriaBody
): Promise<IPatchCategoriaResponse> {
  try {
    const res = await apiClient.patch<IPatchCategoriaResponse>(
      `/api/catalogo/categorias/${categoriaId}`,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo actualizar la categoría" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo actualizar la categoría",
      }
    }
    return { success: false, message: "No se pudo actualizar la categoría" }
  }
}
