import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import {
  apiGetNotificacionesAction,
  apiMarkAllNotificacionesLeidasAction,
  apiMarkNotificacionLeidaAction,
} from "@/features/notifications/action"
import type {
  TNotificacion,
  TNotificacionesScope,
} from "@/features/notifications/interfaces"

type TNotificationsState = {
  scope: TNotificacionesScope | null
  status: TStatus
  message: string | undefined
  notificaciones: TNotificacion[]
  noLeidas: number
}

const initialState: TNotificationsState = {
  scope: null,
  status: "idle",
  message: undefined,
  notificaciones: [],
  noLeidas: 0,
}

const notificationsSlice = createAppSlice({
  name: "notifications",
  initialState,
  reducers: (create) => ({
    fetchNotificaciones: create.asyncThunk(
      async (scope: TNotificacionesScope) =>
        apiGetNotificacionesAction(scope),
      {
        pending: (state, action) => {
          state.status = "loading"
          state.message = undefined
          state.scope = action.meta.arg
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.status = "error"
            state.message = action.payload.message
            state.notificaciones = []
            state.noLeidas = 0
            return
          }
          state.status = "success"
          state.message = action.payload.message
          state.notificaciones = action.payload.data.notificaciones
          state.noLeidas = action.payload.data.no_leidas
        },
        rejected: (state) => {
          state.status = "error"
          state.message = "No se pudieron cargar las notificaciones"
          state.notificaciones = []
          state.noLeidas = 0
        },
      }
    ),
    markNotificacionLeida: create.asyncThunk(
      async ({
        scope,
        id,
      }: {
        scope: TNotificacionesScope
        id: number
      }) => apiMarkNotificacionLeidaAction(scope, id),
      {
        fulfilled: (state, action) => {
          if (!action.payload.success) return
          const id = action.meta.arg.id
          state.notificaciones = state.notificaciones.map((item) =>
            item.id === id ? { ...item, leida: true } : item
          )
          if (action.payload.data) {
            state.noLeidas = action.payload.data.no_leidas
          } else {
            state.noLeidas = Math.max(0, state.noLeidas - 1)
          }
        },
      }
    ),
    markAllNotificacionesLeidas: create.asyncThunk(
      async (scope: TNotificacionesScope) =>
        apiMarkAllNotificacionesLeidasAction(scope),
      {
        fulfilled: (state, action) => {
          if (!action.payload.success) return
          state.notificaciones = state.notificaciones.map((item) => ({
            ...item,
            leida: true,
          }))
          state.noLeidas = action.payload.data?.no_leidas ?? 0
        },
      }
    ),
  }),
  selectors: {
    selectNotificationsView: (state) => state,
  },
})

export const {
  fetchNotificaciones,
  markNotificacionLeida,
  markAllNotificacionesLeidas,
} = notificationsSlice.actions

export const { selectNotificationsView } = notificationsSlice.selectors

export default notificationsSlice.reducer
