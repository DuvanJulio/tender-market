export type TUserRole = "tendero" | "proveedor" | "admin"

export type TUserAccountStatus = "activo" | "inactivo" | "bloqueado"

export interface ISignInRequest {
  email: string
  password: string
}

export interface ISignInResponseData {
  token: string
  rol: TUserRole
}

export interface ISignInResponse {
  success: boolean
  message: string
  data?: ISignInResponseData
}

/** @deprecated Usar TSignInFormData desde const/sign-in-schema */
export type SignInFormData = {
  email: string
  password: string
  rememberMe: boolean
}

/** @deprecated Usar ISignInResponse */
export type SignInResponse = ISignInResponse
