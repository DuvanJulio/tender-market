import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import {
  apiCancelTenderoPedidoAction,
  apiGetTenderoCheckoutAction,
  apiGetTenderoPedidosAction,
  apiPostTenderoPedidoAction,
} from "@/features/shopman/pedidos/action"
import type {
  IPostTenderoPedidoBody,
  TFetchTenderoPedidosParams,
  TTenderoPedidoApi,
} from "@/features/shopman/pedidos/interfaces"
import {
  mapPedidoApiToHistoryOrder,
  mapPedidoApiToOrder,
  type TMappedOrder,
} from "@/features/shopman/pedidos/utils/pedido-mapper"

type TCheckoutData = {
  direccion: string
  contacto: string
  telefono: string
  nombre_tienda: string
}

type TShopmanPedidosState = {
  listView: {
    status: TStatus
    message: string | undefined
    orders: TMappedOrder[]
    activosCount: number
    query: TFetchTenderoPedidosParams
  }
  historyView: {
    status: TStatus
    message: string | undefined
    orders: ReturnType<typeof mapPedidoApiToHistoryOrder>[]
    query: TFetchTenderoPedidosParams
  }
  checkout: {
    status: TStatus
    message: string | undefined
    data: TCheckoutData | null
  }
  createPedido: {
    status: TStatus
    message: string | undefined
  }
  cancelPedido: {
    status: TStatus
    message: string | undefined
    pedidoId: string | null
  }
}

const initialState: TShopmanPedidosState = {
  listView: {
    status: "idle",
    message: undefined,
    orders: [],
    activosCount: 0,
    query: {},
  },
  historyView: {
    status: "idle",
    message: undefined,
    orders: [],
    query: { historial: true },
  },
  checkout: {
    status: "idle",
    message: undefined,
    data: null,
  },
  createPedido: {
    status: "idle",
    message: undefined,
  },
  cancelPedido: {
    status: "idle",
    message: undefined,
    pedidoId: null,
  },
}

function upsertOrder(orders: TMappedOrder[], updated: TTenderoPedidoApi) {
  const mapped = mapPedidoApiToOrder(updated)
  const exists = orders.some((order) => order.id === mapped.id)
  if (!exists) return [mapped, ...orders]
  return orders.map((order) => (order.id === mapped.id ? mapped : order))
}

const shopmanPedidosSlice = createAppSlice({
  name: "shopmanPedidos",
  initialState,
  reducers: (create) => ({
    fetchPedidos: create.asyncThunk(
      async (params: TFetchTenderoPedidosParams) =>
        apiGetTenderoPedidosAction(params),
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
            state.listView.orders = []
            state.listView.activosCount = 0
            return
          }
          state.listView.status = "success"
          state.listView.orders = action.payload.data.pedidos.map(
            mapPedidoApiToOrder
          )
          state.listView.activosCount = action.payload.data.activos_count
          state.listView.message = action.payload.message
        },
        rejected: (state) => {
          state.listView.status = "error"
          state.listView.message = "No se pudieron cargar los pedidos"
          state.listView.orders = []
        },
      }
    ),
    fetchHistorial: create.asyncThunk(
      async (params: TFetchTenderoPedidosParams) =>
        apiGetTenderoPedidosAction({ ...params, historial: true }),
      {
        pending: (state, action) => {
          state.historyView.status = "loading"
          state.historyView.message = undefined
          state.historyView.query = { ...action.meta.arg, historial: true }
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.historyView.status = "error"
            state.historyView.message = action.payload.message
            state.historyView.orders = []
            return
          }
          state.historyView.status = "success"
          state.historyView.orders = action.payload.data.pedidos.map(
            mapPedidoApiToHistoryOrder
          )
          state.historyView.message = action.payload.message
        },
        rejected: (state) => {
          state.historyView.status = "error"
          state.historyView.message = "No se pudo cargar el historial"
          state.historyView.orders = []
        },
      }
    ),
    fetchCheckout: create.asyncThunk(async () => apiGetTenderoCheckoutAction(), {
      pending: (state) => {
        state.checkout.status = "loading"
        state.checkout.message = undefined
      },
      fulfilled: (state, action) => {
        if (!action.payload.success || !action.payload.data) {
          state.checkout.status = "error"
          state.checkout.message = action.payload.message
          state.checkout.data = null
          return
        }
        state.checkout.status = "success"
        state.checkout.data = action.payload.data
        state.checkout.message = action.payload.message
      },
      rejected: (state) => {
        state.checkout.status = "error"
        state.checkout.message = "No se pudieron cargar los datos de entrega"
      },
    }),
    createPedido: create.asyncThunk(
      async (body: IPostTenderoPedidoBody) => apiPostTenderoPedidoAction(body),
      {
        pending: (state) => {
          state.createPedido.status = "loading"
          state.createPedido.message = undefined
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.createPedido.status = "error"
            state.createPedido.message = action.payload.message
            return
          }
          state.createPedido.status = "success"
          state.createPedido.message = action.payload.message
          for (const pedido of action.payload.data.pedidos) {
            state.listView.orders = upsertOrder(state.listView.orders, pedido)
          }
          state.listView.activosCount += action.payload.data.pedidos.length
        },
        rejected: (state) => {
          state.createPedido.status = "error"
          state.createPedido.message = "No se pudo realizar el pedido"
        },
      }
    ),
    cancelPedido: create.asyncThunk(
      async (codigo: string) => apiCancelTenderoPedidoAction(codigo),
      {
        pending: (state, action) => {
          state.cancelPedido.status = "loading"
          state.cancelPedido.message = undefined
          state.cancelPedido.pedidoId = action.meta.arg
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.cancelPedido.status = "error"
            state.cancelPedido.message = action.payload.message
            return
          }
          state.cancelPedido.status = "success"
          state.cancelPedido.message = action.payload.message
          state.cancelPedido.pedidoId = null
          const updated = action.payload.data
          state.listView.orders = state.listView.orders.filter(
            (order) => order.id !== updated.id
          )
          state.listView.activosCount = Math.max(
            0,
            state.listView.activosCount - 1
          )
          state.historyView.orders = [
            mapPedidoApiToHistoryOrder(updated),
            ...state.historyView.orders.filter((order) => order.id !== updated.id),
          ]
        },
        rejected: (state) => {
          state.cancelPedido.status = "error"
          state.cancelPedido.message = "No se pudo cancelar el pedido"
        },
      }
    ),
    resetCreatePedido: create.reducer((state) => {
      state.createPedido = initialState.createPedido
    }),
    resetCancelPedido: create.reducer((state) => {
      state.cancelPedido = initialState.cancelPedido
    }),
  }),
  selectors: {
    selectShopmanPedidosListView: (state) => state.listView,
    selectShopmanPedidosHistoryView: (state) => state.historyView,
    selectShopmanCheckoutView: (state) => state.checkout,
    selectShopmanCreatePedido: (state) => state.createPedido,
    selectShopmanCancelPedido: (state) => state.cancelPedido,
  },
})

export const {
  fetchPedidos,
  fetchHistorial,
  fetchCheckout,
  createPedido,
  cancelPedido,
  resetCreatePedido,
  resetCancelPedido,
} = shopmanPedidosSlice.actions

export const {
  selectShopmanPedidosListView,
  selectShopmanPedidosHistoryView,
  selectShopmanCheckoutView,
  selectShopmanCreatePedido,
  selectShopmanCancelPedido,
} = shopmanPedidosSlice.selectors

export default shopmanPedidosSlice.reducer
