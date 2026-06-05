import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { apiGetProveedorDashboardAction } from "@/features/proveedor/dashboard/action"
import type { TProveedorDashboardData } from "@/features/proveedor/dashboard/interfaces"

type TProveedorDashboardState = {
  view: {
    status: TStatus
    message: string | undefined
    data?: TProveedorDashboardData
  }
}

const initialState: TProveedorDashboardState = {
  view: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
}

const proveedorDashboardSlice = createAppSlice({
  name: "proveedorDashboard",
  initialState,
  reducers: (create) => ({
    resetProveedorDashboard: create.reducer((state) => {
      state.view = initialState.view
    }),
    fetchProveedorDashboard: create.asyncThunk(
      async () => apiGetProveedorDashboardAction(),
      {
        pending: (state) => {
          state.view.status = "loading"
          state.view.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.view.status = "error"
            state.view.message = action.payload.message
            return
          }
          state.view.status = "success"
          state.view.data = action.payload.data
          state.view.message = action.payload.message
        },
        rejected: (state) => {
          state.view.status = "error"
          state.view.message = "No se pudo cargar el dashboard"
        },
      }
    ),
  }),
  selectors: {
    selectProveedorDashboardView: (state) => state.view,
  },
})

export const { fetchProveedorDashboard, resetProveedorDashboard } =
  proveedorDashboardSlice.actions
export const { selectProveedorDashboardView } = proveedorDashboardSlice.selectors
export default proveedorDashboardSlice.reducer
