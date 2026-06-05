import axios from "axios"
import { apiClient } from "@/lib/api-client"

export type IPatchProfileResponse = {
  success: boolean
  message: string
  data?: {
    email?: string
    telefono?: string
  }
}

export type IPatchPasswordResponse = {
  success: boolean
  message: string
}

export async function patchProfileAction(body: {
  email: string
  telefono: string
}): Promise<IPatchProfileResponse> {
  try {
    const res = await apiClient.patch<IPatchProfileResponse>(
      "/api/auth/profile",
      body
    )
    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo actualizar el perfil" }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo actualizar el perfil",
      }
    }
    return { success: false, message: "No se pudo actualizar el perfil" }
  }
}

export async function patchPasswordAction(body: {
  current_password: string
  new_password: string
}): Promise<IPatchPasswordResponse> {
  try {
    const res = await apiClient.patch<IPatchPasswordResponse>(
      "/api/auth/password",
      body
    )
    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudo actualizar la contraseña",
      }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudo actualizar la contraseña",
      }
    }
    return { success: false, message: "No se pudo actualizar la contraseña" }
  }
}
