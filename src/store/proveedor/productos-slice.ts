import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { DEFAULT_PAGE_SIZE, type TPaginationMeta } from "@/types/pagination"
import {
  apiDeleteProveedorProductoAction,
  apiGetProveedorProductosAction,
  apiPatchProveedorProductoAction,
  apiPostProveedorProductoAction,
} from "@/features/proveedor/productos/action"
import type {
  TFetchProveedorProductosParams,
  TPatchProveedorProductoBody,
  TPostProveedorProductoBody,
  TProveedorProducto,
  TProveedorProductosSummary,
} from "@/features/proveedor/productos/interfaces"

const emptyPagination: TPaginationMeta = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
}

const emptySummary: TProveedorProductosSummary = {
  total: 0,
  activos: 0,
  pendientes: 0,
  inactivos: 0,
  bajo_stock: 0,
}

type TProveedorProductosState = {
  listView: {
    status: TStatus
    message: string | undefined
    productos: TProveedorProducto[]
    summary: TProveedorProductosSummary
    pagination: TPaginationMeta
    query: TFetchProveedorProductosParams
  }
  saveProducto: {
    status: TStatus
    message: string | undefined
  }
  deleteProducto: {
    status: TStatus
    message: string | undefined
    productoId: number | null
  }
}

const initialQuery: TFetchProveedorProductosParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

const initialState: TProveedorProductosState = {
  listView: {
    status: "idle",
    message: undefined,
    productos: [],
    summary: emptySummary,
    pagination: emptyPagination,
    query: initialQuery,
  },
  saveProducto: {
    status: "idle",
    message: undefined,
  },
  deleteProducto: {
    status: "idle",
    message: undefined,
    productoId: null,
  },
}

const proveedorProductosSlice = createAppSlice({
  name: "proveedorProductos",
  initialState,
  reducers: (create) => ({
    fetchProductos: create.asyncThunk(
      async (params: TFetchProveedorProductosParams) =>
        apiGetProveedorProductosAction(params),
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
          state.listView.productos = action.payload.data.productos.items
          state.listView.pagination = action.payload.data.productos.pagination
          state.listView.summary = action.payload.data.summary
          state.listView.message = action.payload.message
        },
        rejected: (state) => {
          state.listView.status = "error"
          state.listView.message = "No se pudieron cargar los productos"
          state.listView.productos = []
        },
      }
    ),
    createProducto: create.asyncThunk(
      async (body: TPostProveedorProductoBody) =>
        apiPostProveedorProductoAction(body),
      {
        pending: (state) => {
          state.saveProducto.status = "loading"
          state.saveProducto.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.saveProducto.status = "error"
            state.saveProducto.message = action.payload.message
            return
          }
          state.saveProducto.status = "success"
          state.saveProducto.message = action.payload.message
        },
        rejected: (state) => {
          state.saveProducto.status = "error"
          state.saveProducto.message = "No se pudo guardar el producto"
        },
      }
    ),
    updateProducto: create.asyncThunk(
      async ({
        productoId,
        body,
      }: {
        productoId: number
        body: TPatchProveedorProductoBody
      }) => apiPatchProveedorProductoAction(productoId, body),
      {
        pending: (state) => {
          state.saveProducto.status = "loading"
          state.saveProducto.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.saveProducto.status = "error"
            state.saveProducto.message = action.payload.message
            return
          }
          state.saveProducto.status = "success"
          state.saveProducto.message = action.payload.message
        },
        rejected: (state) => {
          state.saveProducto.status = "error"
          state.saveProducto.message = "No se pudo guardar el producto"
        },
      }
    ),
    deleteProducto: create.asyncThunk(
      async (productoId: number) => apiDeleteProveedorProductoAction(productoId),
      {
        pending: (state, action) => {
          state.deleteProducto.status = "loading"
          state.deleteProducto.message = undefined
          state.deleteProducto.productoId = action.meta.arg
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.deleteProducto.status = "error"
            state.deleteProducto.message = action.payload.message
            return
          }
          state.deleteProducto.status = "success"
          state.deleteProducto.message = action.payload.message
          state.deleteProducto.productoId = null
        },
        rejected: (state) => {
          state.deleteProducto.status = "error"
          state.deleteProducto.message = "No se pudo eliminar el producto"
        },
      }
    ),
    resetSaveProducto: create.reducer((state) => {
      state.saveProducto = initialState.saveProducto
    }),
    resetDeleteProducto: create.reducer((state) => {
      state.deleteProducto = initialState.deleteProducto
    }),
    resetProveedorProductos: create.reducer((state) => {
      state.listView = initialState.listView
      state.saveProducto = initialState.saveProducto
      state.deleteProducto = initialState.deleteProducto
    }),
  }),
  selectors: {
    selectProveedorProductosListView: (state) => state.listView,
    selectProveedorProductosQuery: (state) => state.listView.query,
    selectSaveProveedorProducto: (state) => state.saveProducto,
    selectDeleteProveedorProducto: (state) => state.deleteProducto,
  },
})

export const {
  fetchProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  resetSaveProducto,
  resetDeleteProducto,
  resetProveedorProductos,
} = proveedorProductosSlice.actions

export const {
  selectProveedorProductosListView,
  selectProveedorProductosQuery,
  selectSaveProveedorProducto,
  selectDeleteProveedorProducto,
} = proveedorProductosSlice.selectors

export default proveedorProductosSlice.reducer
