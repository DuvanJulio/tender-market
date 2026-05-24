import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import type { TSignUpFormData } from "@/features/auth/sign-up/const"
import type { TSignUpStep } from "@/features/auth/sign-up/interfaces"
import { signUpAction } from "@/features/auth/sign-up/action"

type TSignUpWizardState = {
  step: TSignUpStep
  showPassword: boolean
  showConfirmPassword: boolean
}

type TSignUpState = {
  wizard: TSignUpWizardState
  register: {
    status: TStatus
    message: string | undefined
  }
}

const initialState: TSignUpState = {
  wizard: {
    step: 1,
    showPassword: false,
    showConfirmPassword: false,
  },
  register: {
    status: "idle",
    message: undefined,
  },
}

const signUpSlice = createAppSlice({
  name: "signUp",
  initialState,
  reducers: (create) => ({
    setStep: create.reducer((state, action: { payload: TSignUpStep }) => {
      state.wizard.step = action.payload
      state.register.message = undefined
    }),
    toggleShowPassword: create.reducer((state) => {
      state.wizard.showPassword = !state.wizard.showPassword
    }),
    toggleShowConfirmPassword: create.reducer((state) => {
      state.wizard.showConfirmPassword = !state.wizard.showConfirmPassword
    }),
    clearRegisterError: create.reducer((state) => {
      state.register.message = undefined
      if (state.register.status === "error") {
        state.register.status = "idle"
      }
    }),
    registerUser: create.asyncThunk(
      async (data: TSignUpFormData) => signUpAction(data),
      {
        pending: (state) => {
          state.register.status = "loading"
          state.register.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.register.status = "error"
            state.register.message = action.payload.message
            return
          }
          state.register.status = "success"
          state.register.message = action.payload.message
        },
        rejected: (state) => {
          state.register.status = "error"
          state.register.message = "Error de conexión. Intenta de nuevo."
        },
      }
    ),
  }),
  selectors: {
    selectSignUpWizard: (state) => state.wizard,
    selectSignUpRegister: (state) => state.register,
  },
})

export const {
  setStep,
  toggleShowPassword,
  toggleShowConfirmPassword,
  clearRegisterError,
  registerUser,
} = signUpSlice.actions

export const { selectSignUpWizard, selectSignUpRegister } = signUpSlice.selectors

export default signUpSlice.reducer
