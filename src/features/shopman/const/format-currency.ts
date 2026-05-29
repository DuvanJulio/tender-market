const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
})

export function formatShopmanCurrency(value: number) {
  return currencyFormatter.format(value)
}
