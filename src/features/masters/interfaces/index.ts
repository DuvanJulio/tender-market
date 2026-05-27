import type { TBaseResponse } from "@/types/base-respnse"
import type { ICityOption } from "./city"

export type { ICityOption }
export type {
  IDepartmentOption,
  IGetDepartmentsResponse,
  IPostDepartmentResponse,
  TPostDepartmentBody,
} from "./department"

export type IGetCitiesResponse = TBaseResponse<ICityOption[]>
export type IPostCityResponse = TBaseResponse<ICityOption>
export type IDeleteCityResponse = TBaseResponse<{ id: number }>

export type TPostCityBody = {
  nombre: string
  departamento_id: number
  estado: boolean
}
