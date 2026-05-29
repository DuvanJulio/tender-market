import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { DEFAULT_PAGE_SIZE, type TPaginationMeta } from "@/types/pagination"
import {
  apiDeleteProductoAction,
  apiGetProductosAction,
  apiPatchProductoEstadoAction,
} from "@/features/admin/productos/action"
import type {
  TAdminProducto,
  TAdminProductosSummary,
  TFetchProductosParams,
  TProductoEstado,
} from "@/features/admin/productos/interfaces"

type TModeratePayload = {
  productoId: number
  estado: Extract<TProductoEstado, "publicado" | "inactivo">
}

const emptyPagination: TPaginationMeta = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
}

type TAdminProductosState = {
  listView: {
    status: TStatus
    message: string | undefined
    productos: TAdminProducto[]
    summary: TAdminProductosSummary | null
    pagination: TPaginationMeta
    query: TFetchProductosParams
  }
  moderateProducto: {
    status: TStatus
    message: string | undefined
    productoId: number | null
  }
  deleteProducto: {
    status: TStatus
    message: string | undefined
    productoId: number | null
  }
}

const emptySummary: TAdminProductosSummary = {
  total: 0,
  activos: 0,
  pendientes: 0,
  rechazados: 0,
}

const initialQuery: TFetchProductosParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

const initialState: TAdminProductosState = {
  listView: {
    status: "idle",
    message: undefined,
    productos: [],
    summary: null,
    pagination: emptyPagination,
    query: initialQuery,
  },
  moderateProducto: {
    status: "idle",
    message: undefined,
    productoId: null,
  },
  deleteProducto: {
    status: "idle",
    message: undefined,
    productoId: null,
  },
}

const adminProductosSlice = createAppSlice({
  name: "adminProductos",
  initialState,
  reducers: (create) => ({
    fetchProductos: create.asyncThunk(
      async (params: TFetchProductosParams) => apiGetProductosAction(params),
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
            state.listView.productos = []
            state.listView.summary = emptySummary
            return
          }
          state.listView.status = "success"
          state.listView.message = action.payload.message
          state.listView.productos = action.payload.data.productos.items
          state.listView.pagination = action.payload.data.productos.pagination
          state.listView.summary = action.payload.data.summary
        },
        rejected: (state) => {
          state.listView.status = "error"
          state.listView.message = "No se pudieron cargar los productos"
          state.listView.productos = []
          state.listView.summary = emptySummary
        },
      }
    ),
    moderateProducto: create.asyncThunk(
      async ({ productoId, estado }: TModeratePayload) =>
        apiPatchProductoEstadoAction(productoId, estado),
      {
        pending: (state, action) => {
          state.moderateProducto.status = "loading"
          state.moderateProducto.message = undefined
          state.moderateProducto.productoId = action.meta.arg.productoId
        },
        fulfilled: (state, action) => {
          state.moderateProducto.status = action.payload.success
            ? "success"
            : "error"
          state.moderateProducto.message = action.payload.message
          state.moderateProducto.productoId = null

          if (action.payload.success && action.payload.data) {
            const { id, estado } = action.payload.data
            state.listView.productos = state.listView.productos.map((p) =>
              p.id === id ? { ...p, estado } : p
            )
          }
        },
        rejected: (state) => {
          state.moderateProducto.status = "error"
          state.moderateProducto.message = "No se pudo actualizar el producto"
          state.moderateProducto.productoId = null
        },
      }
    ),
    resetModerateProducto: create.reducer((state) => {
      state.moderateProducto.status = "idle"
      state.moderateProducto.message = undefined
      state.moderateProducto.productoId = null
    }),
    deleteProducto: create.asyncThunk(
      async (productoId: number) => apiDeleteProductoAction(productoId),
      {
        pending: (state, action) => {
          state.deleteProducto.status = "loading"
          state.deleteProducto.message = undefined
          state.deleteProducto.productoId = action.meta.arg
        },
        fulfilled: (state, action) => {
          state.deleteProducto.status = action.payload.success
            ? "success"
            : "error"
          state.deleteProducto.message = action.payload.message
          state.deleteProducto.productoId = null
        },
        rejected: (state) => {
          state.deleteProducto.status = "error"
          state.deleteProducto.message = "No se pudo eliminar el producto"
          state.deleteProducto.productoId = null
        },
      }
    ),
    resetDeleteProducto: create.reducer((state) => {
      state.deleteProducto.status = "idle"
      state.deleteProducto.message = undefined
      state.deleteProducto.productoId = null
    }),
  }),
  selectors: {
    selectProductosListView: (state) => state.listView,
    selectProductosQuery: (state) => state.listView.query,
    selectModerateProducto: (state) => state.moderateProducto,
    selectDeleteProducto: (state) => state.deleteProducto,
  },
})

export const {
  fetchProductos,
  moderateProducto,
  deleteProducto,
  resetModerateProducto,
  resetDeleteProducto,
} = adminProductosSlice.actions
export const {
  selectProductosListView,
  selectProductosQuery,
  selectModerateProducto,
  selectDeleteProducto,
} = adminProductosSlice.selectors
export default adminProductosSlice.reducer
