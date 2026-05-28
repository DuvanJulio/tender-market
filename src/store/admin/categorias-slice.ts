import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import {
  apiDeleteCategoriaAction,
  apiGetCategoriasAction,
  apiPostCategoriaAction,
} from "@/features/admin/categorias/action"
import type {
  TCategoria,
  TPostCategoriaBody,
} from "@/features/admin/categorias/interfaces"

type TAdminCategoriasState = {
  listView: {
    status: TStatus
    message: string | undefined
    categorias: TCategoria[]
  }
  createCategoria: {
    status: TStatus
    message: string | undefined
  }
  deleteCategoria: {
    status: TStatus
    message: string | undefined
    categoriaId: number | null
  }
}

const initialState: TAdminCategoriasState = {
  listView: {
    status: "idle",
    message: undefined,
    categorias: [],
  },
  createCategoria: {
    status: "idle",
    message: undefined,
  },
  deleteCategoria: {
    status: "idle",
    message: undefined,
    categoriaId: null,
  },
}

const adminCategoriasSlice = createAppSlice({
  name: "adminCategorias",
  initialState,
  reducers: (create) => ({
    fetchCategorias: create.asyncThunk(async () => apiGetCategoriasAction(), {
      pending: (state) => {
        state.listView.status = "loading"
        state.listView.message = undefined
      },
      fulfilled: (state, action) => {
        if (!action.payload.success) {
          state.listView.status = "error"
          state.listView.message = action.payload.message
          state.listView.categorias = []
          return
        }
        state.listView.status = "success"
        state.listView.message = action.payload.message
        state.listView.categorias = action.payload.data ?? []
      },
      rejected: (state) => {
        state.listView.status = "error"
        state.listView.message = "No se pudieron cargar las categorías"
        state.listView.categorias = []
      },
    }),
    createCategoria: create.asyncThunk(
      async (body: TPostCategoriaBody) => apiPostCategoriaAction(body),
      {
        pending: (state) => {
          state.createCategoria.status = "loading"
          state.createCategoria.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.createCategoria.status = "error"
            state.createCategoria.message = action.payload.message
            return
          }
          state.createCategoria.status = "success"
          state.createCategoria.message = action.payload.message
        },
        rejected: (state) => {
          state.createCategoria.status = "error"
          state.createCategoria.message = "No se pudo crear la categoría"
        },
      }
    ),
    resetCreateCategoria: create.reducer((state) => {
      state.createCategoria.status = "idle"
      state.createCategoria.message = undefined
    }),
    deleteCategoria: create.asyncThunk(
      async (categoriaId: number) => apiDeleteCategoriaAction(categoriaId),
      {
        pending: (state, action) => {
          state.deleteCategoria.status = "loading"
          state.deleteCategoria.message = undefined
          state.deleteCategoria.categoriaId = action.meta.arg
        },
        fulfilled: (state, action) => {
          state.deleteCategoria.status = action.payload.success
            ? "success"
            : "error"
          state.deleteCategoria.message = action.payload.message
          state.deleteCategoria.categoriaId = null

          if (action.payload.success) {
            const deletedId = action.payload.data?.id ?? action.meta.arg
            state.listView.categorias = state.listView.categorias
              .map((cat) => ({
                ...cat,
                subcategorias: cat.subcategorias.filter(
                  (sub) => sub.id !== deletedId
                ),
              }))
              .filter((cat) => cat.id !== deletedId)
          }
        },
        rejected: (state) => {
          state.deleteCategoria.status = "error"
          state.deleteCategoria.message = "No se pudo eliminar la categoría"
          state.deleteCategoria.categoriaId = null
        },
      }
    ),
    resetDeleteCategoria: create.reducer((state) => {
      state.deleteCategoria.status = "idle"
      state.deleteCategoria.message = undefined
      state.deleteCategoria.categoriaId = null
    }),
  }),
  selectors: {
    selectCategoriasListView: (state) => state.listView,
    selectCreateCategoria: (state) => state.createCategoria,
    selectDeleteCategoria: (state) => state.deleteCategoria,
  },
})

export const {
  fetchCategorias,
  createCategoria,
  deleteCategoria,
  resetCreateCategoria,
  resetDeleteCategoria,
} = adminCategoriasSlice.actions
export const {
  selectCategoriasListView,
  selectCreateCategoria,
  selectDeleteCategoria,
} = adminCategoriasSlice.selectors
export default adminCategoriasSlice.reducer
