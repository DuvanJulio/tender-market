const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
})

export function formatProveedorCurrency(value: number) {
  return currencyFormatter.format(value)
}
