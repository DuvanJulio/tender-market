import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { DEFAULT_PAGE_SIZE, type TPaginationMeta } from "@/types/pagination"
import {
  apiDeleteCategoriaAction,
  apiGetCategoriasAction,
  apiPostCategoriaAction,
} from "@/features/admin/categorias/action"
import type {
  TCategoria,
  TFetchCategoriasParams,
  TPostCategoriaBody,
} from "@/features/admin/categorias/interfaces"

const emptyPagination: TPaginationMeta = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
}

type TAdminCategoriasState = {
  listView: {
    status: TStatus
    message: string | undefined
    categorias: TCategoria[]
    pagination: TPaginationMeta
    query: TFetchCategoriasParams
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

const initialQuery: TFetchCategoriasParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

const initialState: TAdminCategoriasState = {
  listView: {
    status: "idle",
    message: undefined,
    categorias: [],
    pagination: emptyPagination,
    query: initialQuery,
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
    fetchCategorias: create.asyncThunk(
      async (params: TFetchCategoriasParams) => apiGetCategoriasAction(params),
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
            state.listView.categorias = []
            return
          }
          state.listView.status = "success"
          state.listView.message = action.payload.message
          state.listView.categorias = action.payload.data.items
          state.listView.pagination = action.payload.data.pagination
        },
        rejected: (state) => {
          state.listView.status = "error"
          state.listView.message = "No se pudieron cargar las categorías"
          state.listView.categorias = []
        },
      }
    ),
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
    selectCategoriasQuery: (state) => state.listView.query,
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
  selectCategoriasQuery,
  selectCreateCategoria,
  selectDeleteCategoria,
} = adminCategoriasSlice.selectors
export default adminCategoriasSlice.reducer
