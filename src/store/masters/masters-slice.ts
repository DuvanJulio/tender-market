import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import type { ICityOption } from "@/features/masters/interfaces"
import { apiGetCitiesAction } from "@/features/masters/action"

type TMastersState = {
  cities: {
    status: TStatus
    message: string | undefined
    items: ICityOption[]
  }
}

const initialState: TMastersState = {
  cities: {
    status: "idle",
    message: undefined,
    items: [],
  },
}

const mastersSlice = createAppSlice({
  name: "masters",
  initialState,
  reducers: (create) => ({
    fetchCities: create.asyncThunk(async () => apiGetCitiesAction(), {
      pending: (state) => {
        state.cities.status = "loading"
        state.cities.message = undefined
      },
      fulfilled: (state, action) => {
        if (!action.payload.success) {
          state.cities.status = "error"
          state.cities.message = action.payload.message
          state.cities.items = []
          return
        }
        state.cities.status = "success"
        state.cities.message = action.payload.message
        state.cities.items = action.payload.data ?? []
      },
      rejected: (state) => {
        state.cities.status = "error"
        state.cities.message = "No se pudieron cargar las ciudades"
        state.cities.items = []
      },
    }),
  }),
  selectors: {
    selectCities: (state) => state.cities,
  },
})

export const { fetchCities } = mastersSlice.actions
export const { selectCities } = mastersSlice.selectors
export default mastersSlice.reducer
