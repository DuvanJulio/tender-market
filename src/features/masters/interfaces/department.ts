import type { TBaseResponse } from "@/types/base-respnse"

export interface IDepartmentOption {
  id: number
  nombre: string
}

export type IGetDepartmentsResponse = TBaseResponse<IDepartmentOption[]>
export type IPostDepartmentResponse = TBaseResponse<IDepartmentOption>

export type TPostDepartmentBody = {
  nombre: string
}
