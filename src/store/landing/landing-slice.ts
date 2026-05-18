import { createAppSlice } from "@/store/slice";
import { TStatus } from "@/types";
import { IGetStatsResponseData, apiGetStatsAction } from "@/features";

type TLandingState = {
    getStats: {
        status: TStatus,
        message: string | undefined,
        data?: IGetStatsResponseData
    }
}

const initialState: TLandingState = {
    getStats: {
        status: "idle",
        message: undefined,
        data: undefined
    }
}

const landingSlice = createAppSlice({
    name: "landing",
    initialState,
    reducers: (create) => ({
        getStats: create.asyncThunk(
            async () => {
                const response = await apiGetStatsAction()
                return response
            },
            {
                pending: (state) => {
                    state.getStats.status = "loading"
                },
                fulfilled: (state, action) => {
                    if (!action.payload.success) {
                        state.getStats.status = "error"
                        state.getStats.message = action.payload.message
                        return
                    }
                    state.getStats.status = "success"
                    state.getStats.data = action.payload.data
                    state.getStats.message = action.payload.message
                },
                rejected: (state) => {
                    state.getStats.status = "error"
                    state.getStats.message = "Error al obtener estadísticas"
                }
            }
        )
    }),
    selectors: {
        selectGetStats: (state) => state.getStats
    }

})

export const { getStats } = landingSlice.actions
export const { selectGetStats } = landingSlice.selectors
export default landingSlice.reducer