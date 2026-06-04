import axios from "axios"
import type {
  IGetTenderoCheckoutResponse,
  IGetTenderoPedidosResponse,
  IPatchCancelarTenderoPedidoResponse,
  IPostTenderoPedidoBody,
  IPostTenderoPedidoResponse,
  TFetchTenderoPedidosParams,
} from "../interfaces"
import { apiClient } from "@/lib/api-client"

function buildQuery(params: TFetchTenderoPedidosParams) {
  const search = new URLSearchParams()
  if (params.search?.trim()) search.set("search", params.search.trim())
  if (params.estado) search.set("estado", params.estado)
  if (params.historial) search.set("historial", "true")
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function apiGetTenderoPedidosAction(
  params: TFetchTenderoPedidosParams = {}
): Promise<IGetTenderoPedidosResponse> {
  try {
    const res = await apiClient.get<IGetTenderoPedidosResponse>(
      `/api/tendero/pedidos${buildQuery(params)}`
    )
    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudieron cargar los pedidos" }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudieron cargar los pedidos",
      }
    }
    return { success: false, message: "No se pudieron cargar los pedidos" }
  }
}

export async function apiPostTenderoPedidoAction(
  body: IPostTenderoPedidoBody
): Promise<IPostTenderoPedidoResponse> {
  try {
    const res = await apiClient.post<IPostTenderoPedidoResponse>(
      "/api/tendero/pedidos",
      body
    )
    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo realizar el pedido" }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo realizar el pedido",
      }
    }
    return { success: false, message: "No se pudo realizar el pedido" }
  }
}

export async function apiCancelTenderoPedidoAction(
  codigo: string
): Promise<IPatchCancelarTenderoPedidoResponse> {
  try {
    const res = await apiClient.patch<IPatchCancelarTenderoPedidoResponse>(
      `/api/tendero/pedidos/${encodeURIComponent(codigo)}/cancelar`
    )
    if (res.status < 200 || res.status >= 300) {
      return { success: false, message: "No se pudo cancelar el pedido" }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ?? "No se pudo cancelar el pedido",
      }
    }
    return { success: false, message: "No se pudo cancelar el pedido" }
  }
}

export async function apiGetTenderoCheckoutAction(): Promise<IGetTenderoCheckoutResponse> {
  try {
    const res = await apiClient.get<IGetTenderoCheckoutResponse>(
      "/api/tendero/checkout"
    )
    if (res.status < 200 || res.status >= 300) {
      return {
        success: false,
        message: "No se pudieron cargar los datos de entrega",
      }
    }
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ??
          "No se pudieron cargar los datos de entrega",
      }
    }
    return {
      success: false,
      message: "No se pudieron cargar los datos de entrega",
    }
  }
}
