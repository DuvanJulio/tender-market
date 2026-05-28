"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store"
import { fetchProductos } from "@/store/admin/productos-slice"
import { ProductosView } from "../components"

export function ProductosTemplate() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProductos())
  }, [dispatch])

  return <ProductosView />
}

export default ProductosTemplate
