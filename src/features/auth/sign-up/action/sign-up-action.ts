import axios from "axios"
import type { ISignUpRequest, ISignUpResponse, TSignUpRole } from "../interfaces"
import type { TSignUpFormData } from "../const"
import { apiClient } from "@/lib/api-client"

const SIGN_UP_ENDPOINT = "/api/auth/sign-up"

function mapFormDataToRequest(data: TSignUpFormData): ISignUpRequest {
  const base: ISignUpRequest = {
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    password: data.password,
    telefono: data.telefono,
    rol: data.rol,
    ciudad_id: data.ciudad_id,
    direccion: data.direccion,
    barrio: data.barrio,
  }

  if (data.rol === "tendero") {
    return {
      ...base,
      nombre_tienda: data.nombre_tienda,
      nit_tienda: data.nit_tienda || undefined,
    }
  }

  return {
    ...base,
    nombre_empresa: data.nombre_empresa,
    nit_empresa: data.nit_empresa || undefined,
    nombre_contacto: `${data.nombre} ${data.apellido}`.trim(),
  }
}

export async function signUpAction(
  data: TSignUpFormData
): Promise<ISignUpResponse> {
  const payload: ISignUpRequest = mapFormDataToRequest(data)

  try {
    const res = await apiClient.post<ISignUpResponse>(SIGN_UP_ENDPOINT, payload)

    if (res.status < 200 || res.status >= 300) {
      throw new Error(res.data.message)
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "Error al registrar el usuario",
      }
    }

    return { success: false, message: "Error de conexión. Intenta de nuevo." }
  }
}

export type { TSignUpRole }
