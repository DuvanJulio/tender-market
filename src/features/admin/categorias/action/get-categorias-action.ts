import axios from "axios"
import type { IGetCategoriasResponse } from "../interfaces"
import { apiClient } from "@/lib/api-client"

const GET_CATEGORIAS_ENDPOINT = "/api/catalogo/categorias"

export async function apiGetCategoriasAction(): Promise<IGetCategoriasResponse> {
  try {
    const res = await apiClient.get<IGetCategoriasResponse>(
      GET_CATEGORIAS_ENDPOINT
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar las categorías" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar las categorías",
      }
    }
    return { success: false, message: "No se pudieron cargar las categorías" }
  }
}
