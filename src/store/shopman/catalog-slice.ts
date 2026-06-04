import { createAppSlice } from "@/store/slice"
import type { TStatus } from "@/types"
import { apiGetCatalogoAction } from "@/features/shopman/catalog/action"
import { mapCatalogoFromApi } from "@/features/shopman/catalog/const"
import type {
  TCatalogData,
  TFetchCatalogoParams,
} from "@/features/shopman/catalog/interfaces"

const emptyCatalog: TCatalogData = {
  categories: [{ id: "all", label: "Todos", count: 0 }],
  products: [],
  totalProductos: 0,
}

type TShopmanCatalogState = {
  status: TStatus
  message: string | undefined
  catalog: TCatalogData
  query: TFetchCatalogoParams
}

const initialState: TShopmanCatalogState = {
  status: "idle",
  message: undefined,
  catalog: emptyCatalog,
  query: {},
}

const shopmanCatalogSlice = createAppSlice({
  name: "shopmanCatalog",
  initialState,
  reducers: (create) => ({
    fetchCatalogo: create.asyncThunk(
      async (params: TFetchCatalogoParams) => apiGetCatalogoAction(params),
      {
        pending: (state, action) => {
          state.status = "loading"
          state.message = undefined
          state.query = action.meta.arg
        },
        fulfilled: (state, action) => {
          if (!action.payload.success || !action.payload.data) {
            state.status = "error"
            state.message = action.payload.message
            state.catalog = emptyCatalog
            return
          }
          state.status = "success"
          state.message = action.payload.message
          state.catalog = mapCatalogoFromApi(action.payload.data)
        },
        rejected: (state) => {
          state.status = "error"
          state.message = "No se pudo cargar el catálogo"
          state.catalog = emptyCatalog
        },
      }
    ),
  }),
  selectors: {
    selectShopmanCatalogView: (state) => state,
    selectShopmanCatalogQuery: (state) => state.query,
  },
})

export const { fetchCatalogo } = shopmanCatalogSlice.actions

export const { selectShopmanCatalogView, selectShopmanCatalogQuery } =
  shopmanCatalogSlice.selectors

export default shopmanCatalogSlice.reducer
