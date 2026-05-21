export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    rol: string;
  };
}
