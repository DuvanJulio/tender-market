import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import type { IDepartmentOption } from "@/features/masters/interfaces"
import {
  apiDeleteCityAction,
  apiGetAdminCiudadesAction,
  apiGetDepartmentsAction,
  apiPatchCityAction,
  apiPostCityAction,
  apiPostDepartmentAction,
} from "@/features/admin/ciudades/action"
import type { TPatchCityBody } from "@/features/masters/interfaces"
import type {
  TAdminCiudad,
  TAdminCiudadesSummary,
} from "@/features/admin/ciudades/interfaces"
import type { TPostCityBody } from "@/features/masters/interfaces"

type TAdminCiudadesState = {
  listView: {
    status: TStatus
    message: string | undefined
    ciudades: TAdminCiudad[]
    summary: TAdminCiudadesSummary | null
  }
  departments: {
    status: TStatus
    message: string | undefined
    items: IDepartmentOption[]
  }
  createDepartment: {
    status: TStatus
    message: string | undefined
  }
  createCity: {
    status: TStatus
    message: string | undefined
  }
  deleteCity: {
    status: TStatus
    message: string | undefined
    cityId: number | null
  }
  updateCity: {
    status: TStatus
    message: string | undefined
    cityId: number | null
  }
}

const initialState: TAdminCiudadesState = {
  listView: {
    status: "idle",
    message: undefined,
    ciudades: [],
    summary: null,
  },
  departments: {
    status: "idle",
    message: undefined,
    items: [],
  },
  createDepartment: {
    status: "idle",
    message: undefined,
  },
  createCity: {
    status: "idle",
    message: undefined,
  },
  deleteCity: {
    status: "idle",
    message: undefined,
    cityId: null,
  },
  updateCity: {
    status: "idle",
    message: undefined,
    cityId: null,
  },
}

const adminCiudadesSlice = createAppSlice({
  name: "adminCiudades",
  initialState,
  reducers: (create) => ({
    fetchCiudades: create.asyncThunk(async () => apiGetAdminCiudadesAction(), {
      pending: (state) => {
        state.listView.status = "loading"
        state.listView.message = undefined
      },
      fulfilled: (state, action) => {
        if (!action.payload.success || !action.payload.data) {
          state.listView.status = "error"
          state.listView.message = action.payload.message
          state.listView.ciudades = []
          state.listView.summary = null
          return
        }
        state.listView.status = "success"
        state.listView.message = action.payload.message
        state.listView.ciudades = action.payload.data.ciudades
        state.listView.summary = action.payload.data.summary
      },
      rejected: (state) => {
        state.listView.status = "error"
        state.listView.message = "No se pudieron cargar las ciudades"
        state.listView.ciudades = []
        state.listView.summary = null
      },
    }),
    fetchDepartments: create.asyncThunk(async () => apiGetDepartmentsAction(), {
      pending: (state) => {
        state.departments.status = "loading"
        state.departments.message = undefined
      },
      fulfilled: (state, action) => {
        if (!action.payload.success) {
          state.departments.status = "error"
          state.departments.message = action.payload.message
          state.departments.items = []
          return
        }
        state.departments.status = "success"
        state.departments.message = action.payload.message
        state.departments.items = action.payload.data ?? []
      },
      rejected: (state) => {
        state.departments.status = "error"
        state.departments.message = "No se pudieron cargar los departamentos"
        state.departments.items = []
      },
    }),
    createDepartment: create.asyncThunk(
      async (nombre: string) => apiPostDepartmentAction({ nombre }),
      {
        pending: (state) => {
          state.createDepartment.status = "loading"
          state.createDepartment.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.createDepartment.status = "error"
            state.createDepartment.message = action.payload.message
            return
          }
          state.createDepartment.status = "success"
          state.createDepartment.message = action.payload.message
          const exists = state.departments.items.some(
            (d) => d.id === action.payload.data!.id
          )
          if (!exists) {
            state.departments.items = [
              ...state.departments.items,
              action.payload.data,
            ].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
          }
        },
        rejected: (state) => {
          state.createDepartment.status = "error"
          state.createDepartment.message = "No se pudo crear el departamento"
        },
      }
    ),
    createCity: create.asyncThunk(
      async (body: TPostCityBody) => apiPostCityAction(body),
      {
        pending: (state) => {
          state.createCity.status = "loading"
          state.createCity.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.createCity.status = "error"
            state.createCity.message = action.payload.message
            return
          }
          state.createCity.status = "success"
          state.createCity.message = action.payload.message
        },
        rejected: (state) => {
          state.createCity.status = "error"
          state.createCity.message = "No se pudo crear la ciudad"
        },
      }
    ),
    resetCreateDepartment: create.reducer((state) => {
      state.createDepartment.status = "idle"
      state.createDepartment.message = undefined
    }),
    resetCreateCity: create.reducer((state) => {
      state.createCity.status = "idle"
      state.createCity.message = undefined
    }),
    deleteCity: create.asyncThunk(
      async (cityId: number) => apiDeleteCityAction(cityId),
      {
        pending: (state, action) => {
          state.deleteCity.status = "loading"
          state.deleteCity.message = undefined
          state.deleteCity.cityId = action.meta.arg
        },
        fulfilled: (state, action) => {
          state.deleteCity.status = action.payload.success ? "success" : "error"
          state.deleteCity.message = action.payload.message
          state.deleteCity.cityId = null

          if (action.payload.success) {
            const deletedId = action.payload.data?.id ?? action.meta.arg
            state.listView.ciudades = state.listView.ciudades.filter(
              (c) => c.id !== deletedId
            )
            if (state.listView.summary) {
              state.listView.summary = {
                ...state.listView.summary,
                ciudadesActivas: state.listView.ciudades.filter((c) => c.estado)
                  .length,
              }
            }
          }
        },
        rejected: (state) => {
          state.deleteCity.status = "error"
          state.deleteCity.message = "No se pudo eliminar la ciudad"
          state.deleteCity.cityId = null
        },
      }
    ),
    resetDeleteCity: create.reducer((state) => {
      state.deleteCity.status = "idle"
      state.deleteCity.message = undefined
      state.deleteCity.cityId = null
    }),
    updateCity: create.asyncThunk(
      async (payload: { cityId: number; body: TPatchCityBody }) =>
        apiPatchCityAction(payload.cityId, payload.body),
      {
        pending: (state, action) => {
          state.updateCity.status = "loading"
          state.updateCity.message = undefined
          state.updateCity.cityId = action.meta.arg.cityId
        },
        fulfilled: (state, action) => {
          state.updateCity.status = action.payload.success ? "success" : "error"
          state.updateCity.message = action.payload.message
          state.updateCity.cityId = null

          if (action.payload.success && action.payload.data) {
            const updated = action.payload.data
            const index = state.listView.ciudades.findIndex(
              (c) => c.id === updated.id
            )
            if (index >= 0) {
              const prev = state.listView.ciudades[index]
              state.listView.ciudades[index] = {
                ...prev,
                nombre: updated.nombre,
                departamento_id: updated.departamento_id ?? prev.departamento_id,
                departamento: updated.departamento ?? prev.departamento,
                estado: updated.estado ?? prev.estado,
              }
            }
            if (state.listView.summary) {
              state.listView.summary = {
                ...state.listView.summary,
                ciudadesActivas: state.listView.ciudades.filter((c) => c.estado)
                  .length,
              }
            }
          }
        },
        rejected: (state) => {
          state.updateCity.status = "error"
          state.updateCity.message = "No se pudo actualizar la ciudad"
          state.updateCity.cityId = null
        },
      }
    ),
    resetUpdateCity: create.reducer((state) => {
      state.updateCity.status = "idle"
      state.updateCity.message = undefined
      state.updateCity.cityId = null
    }),
  }),
  selectors: {
    selectCiudadesListView: (state) => state.listView,
    selectDepartments: (state) => state.departments,
    selectCreateDepartment: (state) => state.createDepartment,
    selectCreateCity: (state) => state.createCity,
    selectDeleteCity: (state) => state.deleteCity,
    selectUpdateCity: (state) => state.updateCity,
  },
})

export const {
  fetchCiudades,
  fetchDepartments,
  createDepartment,
  createCity,
  deleteCity,
  resetCreateDepartment,
  resetCreateCity,
  resetDeleteCity,
  updateCity,
  resetUpdateCity,
} = adminCiudadesSlice.actions
export const {
  selectCiudadesListView,
  selectDepartments,
  selectCreateDepartment,
  selectCreateCity,
  selectDeleteCity,
  selectUpdateCity,
} = adminCiudadesSlice.selectors
export default adminCiudadesSlice.reducer
