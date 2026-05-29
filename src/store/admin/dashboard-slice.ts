import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import type { IGetStatsResponseData } from "@/features/landing/interfaces/get-stats-reponse"
import { apiGetDashboardStatsAction } from "@/features/admin/dashboard/action"

type TAdminDashboardState = {
  stats: {
    status: TStatus
    message: string | undefined
    data?: IGetStatsResponseData
  }
}

const initialState: TAdminDashboardState = {
  stats: {
    status: "idle",
    message: undefined,
    data: undefined,
  },
}

const adminDashboardSlice = createAppSlice({
  name: "adminDashboard",
  initialState,
  reducers: (create) => ({
    fetchDashboardStats: create.asyncThunk(
      async () => apiGetDashboardStatsAction(),
      {
        pending: (state) => {
          state.stats.status = "loading"
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.stats.status = "error"
            state.stats.message = action.payload.message
            return
          }
          state.stats.status = "success"
          state.stats.data = action.payload.data
          state.stats.message = action.payload.message
        },
        rejected: (state) => {
          state.stats.status = "error"
          state.stats.message = "Error al cargar el dashboard"
        },
      }
    ),
  }),
  selectors: {
    selectDashboardStats: (state) => state.stats,
  },
})

export const { fetchDashboardStats } = adminDashboardSlice.actions
export const { selectDashboardStats } = adminDashboardSlice.selectors
export default adminDashboardSlice.reducer
