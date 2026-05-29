import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { DEFAULT_PAGE_SIZE, type TPaginationMeta } from "@/types/pagination"
import {
  apiDeleteUsuarioAction,
  apiGetUsuariosAction,
  apiPatchUsuarioAction,
  apiPatchUsuarioEstadoAction,
} from "@/features/admin/usuarios/action"
import type {
  TAdminUsuario,
  TFetchUsuariosParams,
  TPatchUsuarioBody,
  TUsuarioEstado,
} from "@/features/admin/usuarios/interfaces"

const emptyPagination: TPaginationMeta = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
}

type TAdminUsuariosState = {
  listView: {
    status: TStatus
    message: string | undefined
    usuarios: TAdminUsuario[]
    pagination: TPaginationMeta
    query: TFetchUsuariosParams
  }
  updateUsuario: {
    status: TStatus
    message: string | undefined
  }
  updateEstado: {
    status: TStatus
    message: string | undefined
    usuarioId: string | null
  }
  deleteUsuario: {
    status: TStatus
    message: string | undefined
    usuarioId: string | null
  }
}

const initialQuery: TFetchUsuariosParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

const initialState: TAdminUsuariosState = {
  listView: {
    status: "idle",
    message: undefined,
    usuarios: [],
    pagination: emptyPagination,
    query: initialQuery,
  },
  updateUsuario: {
    status: "idle",
    message: undefined,
  },
  updateEstado: {
    status: "idle",
    message: undefined,
    usuarioId: null,
  },
  deleteUsuario: {
    status: "idle",
    message: undefined,
    usuarioId: null,
  },
}

function upsertUsuario(
  usuarios: TAdminUsuario[],
  updated: TAdminUsuario
): TAdminUsuario[] {
  const index = usuarios.findIndex((u) => u.id === updated.id)
  if (index === -1) return usuarios
  const next = [...usuarios]
  next[index] = updated
  return next
}

const adminUsuariosSlice = createAppSlice({
  name: "adminUsuarios",
  initialState,
  reducers: (create) => ({
    fetchUsuarios: create.asyncThunk(
      async (params: TFetchUsuariosParams) => apiGetUsuariosAction(params),
      {
        pending: (state, action) => {
          state.listView.status = "loading"
          state.listView.message = undefined
          state.listView.query = action.meta.arg
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.listView.status = "error"
            state.listView.message = action.payload.message
            state.listView.usuarios = []
            state.listView.pagination = {
              ...state.listView.pagination,
              total: 0,
              totalPages: 0,
            }
            return
          }
          state.listView.status = "success"
          state.listView.message = action.payload.message
          state.listView.usuarios = action.payload.data.items
          state.listView.pagination = action.payload.data.pagination
        },
        rejected: (state) => {
          state.listView.status = "error"
          state.listView.message = "No se pudieron cargar los usuarios"
          state.listView.usuarios = []
        },
      }
    ),
    updateUsuario: create.asyncThunk(
      async ({
        usuarioId,
        body,
      }: {
        usuarioId: string
        body: TPatchUsuarioBody
      }) => apiPatchUsuarioAction(usuarioId, body),
      {
        pending: (state) => {
          state.updateUsuario.status = "loading"
          state.updateUsuario.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.updateUsuario.status = "error"
            state.updateUsuario.message = action.payload.message
            return
          }
          state.updateUsuario.status = "success"
          state.updateUsuario.message = action.payload.message
          state.listView.usuarios = upsertUsuario(
            state.listView.usuarios,
            action.payload.data
          )
        },
        rejected: (state) => {
          state.updateUsuario.status = "error"
          state.updateUsuario.message = "No se pudo actualizar el usuario"
        },
      }
    ),
    resetUpdateUsuario: create.reducer((state) => {
      state.updateUsuario.status = "idle"
      state.updateUsuario.message = undefined
    }),
    updateUsuarioEstado: create.asyncThunk(
      async ({
        usuarioId,
        estado,
      }: {
        usuarioId: string
        estado: Extract<TUsuarioEstado, "activo" | "inactivo">
      }) => apiPatchUsuarioEstadoAction(usuarioId, estado),
      {
        pending: (state, action) => {
          state.updateEstado.status = "loading"
          state.updateEstado.message = undefined
          state.updateEstado.usuarioId = action.meta.arg.usuarioId
        },
        fulfilled: (state, action) => {
          state.updateEstado.status = action.payload.success ? "success" : "error"
          state.updateEstado.message = action.payload.message
          state.updateEstado.usuarioId = null

          if (action.payload.success && action.payload.data) {
            const { id, estado } = action.payload.data
            state.listView.usuarios = state.listView.usuarios.map((u) =>
              u.id === id ? { ...u, estado } : u
            )
          }
        },
        rejected: (state) => {
          state.updateEstado.status = "error"
          state.updateEstado.message = "No se pudo actualizar el estado"
          state.updateEstado.usuarioId = null
        },
      }
    ),
    resetUpdateEstado: create.reducer((state) => {
      state.updateEstado.status = "idle"
      state.updateEstado.message = undefined
      state.updateEstado.usuarioId = null
    }),
    deleteUsuario: create.asyncThunk(
      async (usuarioId: string) => apiDeleteUsuarioAction(usuarioId),
      {
        pending: (state, action) => {
          state.deleteUsuario.status = "loading"
          state.deleteUsuario.message = undefined
          state.deleteUsuario.usuarioId = action.meta.arg
        },
        fulfilled: (state, action) => {
          state.deleteUsuario.status = action.payload.success
            ? "success"
            : "error"
          state.deleteUsuario.message = action.payload.message
          state.deleteUsuario.usuarioId = null
        },
        rejected: (state) => {
          state.deleteUsuario.status = "error"
          state.deleteUsuario.message = "No se pudo eliminar el usuario"
          state.deleteUsuario.usuarioId = null
        },
      }
    ),
    resetDeleteUsuario: create.reducer((state) => {
      state.deleteUsuario.status = "idle"
      state.deleteUsuario.message = undefined
      state.deleteUsuario.usuarioId = null
    }),
  }),
  selectors: {
    selectUsuariosListView: (state) => state.listView,
    selectUsuariosQuery: (state) => state.listView.query,
    selectUpdateUsuario: (state) => state.updateUsuario,
    selectUpdateEstado: (state) => state.updateEstado,
    selectDeleteUsuario: (state) => state.deleteUsuario,
  },
})

export const {
  fetchUsuarios,
  updateUsuario,
  updateUsuarioEstado,
  deleteUsuario,
  resetUpdateUsuario,
  resetUpdateEstado,
  resetDeleteUsuario,
} = adminUsuariosSlice.actions
export const {
  selectUsuariosListView,
  selectUsuariosQuery,
  selectUpdateUsuario,
  selectUpdateEstado,
  selectDeleteUsuario,
} = adminUsuariosSlice.selectors
export default adminUsuariosSlice.reducer
