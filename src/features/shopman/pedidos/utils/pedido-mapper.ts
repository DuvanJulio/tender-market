import type { TOrderStatus } from "../../orders/interfaces"
import type { THistoryStatus } from "../../history/interfaces"
import type { TTenderoPedidoApi, TTenderoPedidoApiStatus } from "../interfaces"

export function mapApiStatusToOrderStatus(
  status: TTenderoPedidoApiStatus
): TOrderStatus {
  switch (status) {
    case "pending":
      return "pendiente"
    case "processing":
      return "procesando"
    case "shipped":
      return "en-camino"
    case "delivered":
      return "entregado"
    case "cancelled":
      return "cancelado"
  }
}

export function mapApiStatusToHistoryStatus(
  status: TTenderoPedidoApiStatus
): THistoryStatus {
  return status === "cancelled" ? "cancelado" : "entregado"
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatProductLabels(products: TTenderoPedidoApi["products"]) {
  const labels = products.map(
    (product) => `${product.name} x${product.quantity}`
  )
  if (labels.length <= 3) return labels
  return [...labels.slice(0, 2), `+${labels.length - 2} más`]
}

export function getOrderStatusNote(status: TOrderStatus): string {
  switch (status) {
    case "pendiente":
      return "Esperando confirmación del proveedor"
    case "procesando":
      return "El proveedor está preparando tu pedido"
    case "en-camino":
      return "Tu pedido está en camino"
    case "entregado":
      return "Pedido entregado correctamente"
    case "cancelado":
      return "Pedido cancelado"
  }
}

export function mapPedidoApiToOrder(pedido: TTenderoPedidoApi) {
  const status = mapApiStatusToOrderStatus(pedido.status)

  return {
    id: pedido.id,
    supplier: pedido.supplier,
    date: formatOrderDate(pedido.occurred_at),
    status,
    total: pedido.total,
    productCount: pedido.items,
    products: formatProductLabels(pedido.products),
    note: getOrderStatusNote(status),
    canRepeat: status === "entregado",
    address: pedido.address,
    contact: pedido.contact,
    supplierPhone: pedido.supplierPhone,
    occurred_at: pedido.occurred_at,
    rawProducts: pedido.products,
  }
}

export type TMappedOrder = ReturnType<typeof mapPedidoApiToOrder>

export function mapPedidoApiToHistoryOrder(pedido: TTenderoPedidoApi) {
  const order = mapPedidoApiToOrder(pedido)
  return {
    ...order,
    status: mapApiStatusToHistoryStatus(pedido.status),
  }
}
