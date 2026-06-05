import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { getUserDataAction } from "@/features/auth/sign-in/actions"
import {
  mapUserProfileFromApi,
  type TUserProfile,
} from "@/features/account/utils/map-user-profile"

type TShopmanUserState = {
  profileView: {
    status: TStatus
    message: string | undefined
    profile: TUserProfile | null
  }
}

const initialState: TShopmanUserState = {
  profileView: {
    status: "idle",
    message: undefined,
    profile: null,
  },
}

const shopmanUserSlice = createAppSlice({
  name: "shopmanUser",
  initialState,
  reducers: (create) => ({
    clearShopmanUser: create.reducer((state) => {
      state.profileView = {
        status: "idle",
        message: undefined,
        profile: null,
      }
    }),
    fetchShopmanUser: create.asyncThunk(async () => getUserDataAction(), {
      pending: (state) => {
        state.profileView.status = "loading"
        state.profileView.message = undefined
      },
      fulfilled: (state, action) => {
        const payload = action.payload

        if (!payload.success || !payload.data?.isAuthenticated) {
          state.profileView.status = "error"
          state.profileView.message =
            payload.message ?? "Sesión no válida. Inicia sesión de nuevo."
          state.profileView.profile = null
          return
        }

        const profile = mapUserProfileFromApi(payload.data)

        if (!profile) {
          state.profileView.status = "error"
          state.profileView.message = "Perfil de usuario incompleto"
          state.profileView.profile = null
          return
        }

        state.profileView.status = "success"
        state.profileView.message = undefined
        state.profileView.profile = profile
      },
      rejected: (state) => {
        state.profileView.status = "error"
        state.profileView.message = "No se pudo cargar tu perfil"
        state.profileView.profile = null
      },
    }),
  }),
  selectors: {
    selectShopmanProfileView: (state) => state.profileView,
    selectShopmanProfile: (state) => state.profileView.profile,
  },
})

export const { clearShopmanUser, fetchShopmanUser } = shopmanUserSlice.actions
export const { selectShopmanProfileView, selectShopmanProfile } =
  shopmanUserSlice.selectors

export default shopmanUserSlice.reducer
