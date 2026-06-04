import { API_BASE_URL, getAuthToken } from "@/lib/api-client"
import type { IPostProductoImagenResponse } from "../interfaces"

const UPLOAD_ENDPOINT = "/api/proveedor/productos/imagen"

export async function apiUploadProductoImagenAction(
  file: File
): Promise<IPostProductoImagenResponse> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const headers: HeadersInit = {}
    const token = getAuthToken()
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(`${API_BASE_URL}${UPLOAD_ENDPOINT}`, {
      method: "POST",
      headers,
      body: formData,
    })

    const data = (await res.json()) as IPostProductoImagenResponse

    if (!res.ok) {
      return {
        success: false,
        message: data.message ?? "No se pudo subir la imagen",
      }
    }

    return data
  } catch {
    return { success: false, message: "No se pudo subir la imagen" }
  }
}
