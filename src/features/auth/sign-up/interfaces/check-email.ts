export interface ICheckEmailResponse {
  success: boolean
  message: string
  data?: {
    available: boolean
  }
}
