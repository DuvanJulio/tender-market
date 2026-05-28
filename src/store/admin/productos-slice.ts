import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import {
  apiDeleteProductoAction,
  apiGetProductosAction,
  apiPatchProductoEstadoAction,
} from "@/features/admin/productos/action"
import type {
  TAdminProducto,
  TAdminProductosSummary,
  TProductoEstado,
} from "@/features/admin/productos/interfaces"

type TModeratePayload = {
  productoId: number
  estado: Extract<TProductoEstado, "publicado" | "inactivo">
}

type TAdminProductosState = {
  listView: {
    status: TStatus
    message: string | undefined
    productos: TAdminProducto[]
    summary: TAdminProductosSummary | null
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

const initialState: TAdminProductosState = {
  listView: {
    status: "idle",
    message: undefined,
    productos: [],
    summary: null,
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

function recomputeSummary(productos: TAdminProducto[]): TAdminProductosSummary {
  return {
    total: productos.length,
    activos: productos.filter((p) => p.estado === "publicado").length,
    pendientes: productos.filter((p) => p.estado === "borrador").length,
    rechazados: productos.filter((p) => p.estado === "inactivo").length,
  }
}

const adminProductosSlice = createAppSlice({
  name: "adminProductos",
  initialState,
  reducers: (create) => ({
    fetchProductos: create.asyncThunk(async () => apiGetProductosAction(), {
      pending: (state) => {
        state.listView.status = "loading"
        state.listView.message = undefined
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
        state.listView.productos = action.payload.data.productos
        state.listView.summary = action.payload.data.summary
      },
      rejected: (state) => {
        state.listView.status = "error"
        state.listView.message = "No se pudieron cargar los productos"
        state.listView.productos = []
        state.listView.summary = emptySummary
      },
    }),
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
            state.listView.summary = recomputeSummary(state.listView.productos)
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

          if (action.payload.success) {
            const deletedId = action.payload.data?.id ?? action.meta.arg
            state.listView.productos = state.listView.productos.filter(
              (p) => p.id !== deletedId
            )
            state.listView.summary = recomputeSummary(state.listView.productos)
          }
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
  selectModerateProducto,
  selectDeleteProducto,
} = adminProductosSlice.selectors
export default adminProductosSlice.reducer
