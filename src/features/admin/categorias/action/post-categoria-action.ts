import axios from "axios"
import type {
  IPostCategoriaResponse,
  TPostCategoriaBody,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

const POST_CATEGORIA_ENDPOINT = "/api/catalogo/categorias"

export async function apiPostCategoriaAction(
  body: TPostCategoriaBody
): Promise<IPostCategoriaResponse> {
  try {
    const res = await apiClient.post<IPostCategoriaResponse>(
      POST_CATEGORIA_ENDPOINT,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo crear la categoría" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo crear la categoría",
      }
    }
    return { success: false, message: "No se pudo crear la categoría" }
  }
}
