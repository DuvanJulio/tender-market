import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { getUserDataAction } from "@/features/auth/sign-in/actions"
import type { TUserRole } from "@/features/auth/sign-in/interfaces"

export type TShopmanUserProfile = {
  nombre: string
  email: string
  rol: TUserRole
  negocio: string
  initials: string
}

type TShopmanUserState = {
  profileView: {
    status: TStatus
    message: string | undefined
    profile: TShopmanUserProfile | null
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

        const { nombre, email, rol, negocio } = payload.data

        if (!email || !rol) {
          state.profileView.status = "error"
          state.profileView.message = "Perfil de usuario incompleto"
          state.profileView.profile = null
          return
        }

        const displayName = nombre?.trim() || email
        const parts = displayName.split(/\s+/).filter(Boolean)
        const initials =
          parts.length >= 2
            ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
            : displayName.slice(0, 2).toUpperCase()

        state.profileView.status = "success"
        state.profileView.message = undefined
        state.profileView.profile = {
          nombre: displayName,
          email,
          rol,
          negocio:
            negocio?.trim() ||
            (rol === "proveedor" ? "Mi empresa" : "Mi tienda"),
          initials,
        }
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
