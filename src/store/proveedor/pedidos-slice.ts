import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import {
  apiGetProveedorPedidosAction,
  apiPatchProveedorPedidoEstadoAction,
} from "@/features/proveedor/pedidos/action"
import type {
  TFetchProveedorPedidosParams,
  TProveedorPedido,
} from "@/features/proveedor/pedidos/interfaces"
import type { TProveedorPedidoStatus } from "@/features/proveedor/pedidos/const"

type TProveedorPedidosState = {
  listView: {
    status: TStatus
    message: string | undefined
    pedidos: TProveedorPedido[]
    pendientesCount: number
    query: TFetchProveedorPedidosParams
  }
  updateEstado: {
    status: TStatus
    message: string | undefined
    pedidoId: string | null
  }
}

const initialState: TProveedorPedidosState = {
  listView: {
    status: "idle",
    message: undefined,
    pedidos: [],
    pendientesCount: 0,
    query: {},
  },
  updateEstado: {
    status: "idle",
    message: undefined,
    pedidoId: null,
  },
}

const proveedorPedidosSlice = createAppSlice({
  name: "proveedorPedidos",
  initialState,
  reducers: (create) => ({
    fetchPedidos: create.asyncThunk(
      async (params: TFetchProveedorPedidosParams) =>
        apiGetProveedorPedidosAction(params),
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
            state.listView.pedidos = []
            state.listView.pendientesCount = 0
            return
          }
          state.listView.status = "success"
          state.listView.pedidos = action.payload.data.pedidos
          state.listView.pendientesCount =
            action.payload.data.pendientes_count
          state.listView.message = action.payload.message
        },
        rejected: (state) => {
          state.listView.status = "error"
          state.listView.message = "No se pudieron cargar los pedidos"
          state.listView.pedidos = []
        },
      }
    ),
    updatePedidoEstado: create.asyncThunk(
      async ({
        codigo,
        estado,
      }: {
        codigo: string
        estado: TProveedorPedidoStatus
      }) => apiPatchProveedorPedidoEstadoAction(codigo, estado),
      {
        pending: (state, action) => {
          state.updateEstado.status = "loading"
          state.updateEstado.message = undefined
          state.updateEstado.pedidoId = action.meta.arg.codigo
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.updateEstado.status = "error"
            state.updateEstado.message = action.payload.message
            return
          }
          state.updateEstado.status = "success"
          state.updateEstado.message = action.payload.message
          state.updateEstado.pedidoId = null
          const updated = action.payload.data
          const previous = state.listView.pedidos.find((p) => p.id === updated.id)
          const filterEstado = state.listView.query.estado
          const hideAfterUpdate =
            filterEstado &&
            filterEstado !== "all" &&
            updated.status !== filterEstado

          if (hideAfterUpdate) {
            state.listView.pedidos = state.listView.pedidos.filter(
              (p) => p.id !== updated.id
            )
          } else {
            state.listView.pedidos = state.listView.pedidos.map((p) =>
              p.id === updated.id ? updated : p
            )
          }

          if (
            previous?.status === "pending" &&
            updated.status !== "pending"
          ) {
            state.listView.pendientesCount = Math.max(
              0,
              state.listView.pendientesCount - 1
            )
          }
        },
        rejected: (state) => {
          state.updateEstado.status = "error"
          state.updateEstado.message = "No se pudo actualizar el pedido"
        },
      }
    ),
    resetUpdatePedidoEstado: create.reducer((state) => {
      state.updateEstado = initialState.updateEstado
    }),
  }),
  selectors: {
    selectProveedorPedidosListView: (state) => state.listView,
    selectProveedorPedidosQuery: (state) => state.listView.query,
    selectUpdateProveedorPedidoEstado: (state) => state.updateEstado,
  },
})

export const {
  fetchPedidos,
  updatePedidoEstado,
  resetUpdatePedidoEstado,
} = proveedorPedidosSlice.actions

export const {
  selectProveedorPedidosListView,
  selectProveedorPedidosQuery,
  selectUpdateProveedorPedidoEstado,
} = proveedorPedidosSlice.selectors

export default proveedorPedidosSlice.reducer
