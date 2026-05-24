import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import type { TSignInFormData } from "@/features/auth/sign-in/const"
import { signInAction } from "@/features/auth/sign-in/actions"

type TSignInState = {
  signIn: {
    status: TStatus
    message: string | undefined
    showPassword: boolean
  }
}

const initialState: TSignInState = {
  signIn: {
    status: "idle",
    message: undefined,
    showPassword: false,
  },
}

const signInSlice = createAppSlice({
  name: "signIn",
  initialState,
  reducers: (create) => ({
    toggleShowPassword: create.reducer((state) => {
      state.signIn.showPassword = !state.signIn.showPassword
    }),
    clearSignInError: create.reducer((state) => {
      state.signIn.message = undefined
      if (state.signIn.status === "error") {
        state.signIn.status = "idle"
      }
    }),
    signInUser: create.asyncThunk(
      async (data: Pick<TSignInFormData, "email" | "password">) =>
        signInAction(data),
      {
        pending: (state) => {
          state.signIn.status = "loading"
          state.signIn.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.signIn.status = "error"
            state.signIn.message = action.payload.message
            return
          }
          state.signIn.status = "success"
          state.signIn.message = action.payload.message
        },
        rejected: (state) => {
          state.signIn.status = "error"
          state.signIn.message = "Error de conexión. Intenta de nuevo."
        },
      }
    ),
  }),
  selectors: {
    selectSignInView: (state) => state.signIn,
  },
})

export const { toggleShowPassword, clearSignInError, signInUser } =
  signInSlice.actions

export const { selectSignInView } = signInSlice.selectors

export default signInSlice.reducer
