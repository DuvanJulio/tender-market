import axios from "axios"
import type {
  IPostDepartmentResponse,
  TPostDepartmentBody,
} from "@/features/masters/interfaces"
import { apiClient } from "@/lib/api-client"

const POST_DEPARTMENT_ENDPOINT = "/api/masters/departments"

export async function apiPostDepartmentAction(
  body: TPostDepartmentBody
): Promise<IPostDepartmentResponse> {
  try {
    const res = await apiClient.post<IPostDepartmentResponse>(
      POST_DEPARTMENT_ENDPOINT,
      body
    )

    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo crear el departamento" }
    }

    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo crear el departamento",
      }
    }
    return { success: false, message: "No se pudo crear el departamento" }
  }
}
