import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import landingReducer from '@/store/landing/landing-slice'
import signInReducer from '@/store/auth/sign-in-slice'
import signUpReducer from '@/store/auth/sign-up-slice'
import mastersReducer from '@/store/masters/masters-slice'
import adminCiudadesReducer from '@/store/admin/ciudades-slice'
import adminCategoriasReducer from '@/store/admin/categorias-slice'
import adminProductosReducer from '@/store/admin/productos-slice'
import adminUsuariosReducer from '@/store/admin/usuarios-slice'
import adminDashboardReducer from '@/store/admin/dashboard-slice'
import proveedorProductosReducer from '@/store/proveedor/productos-slice'
import proveedorDashboardReducer from '@/store/proveedor/dashboard-slice'
import proveedorPedidosReducer from '@/store/proveedor/pedidos-slice'
import shopmanUserReducer from '@/store/shopman/user-slice'
import shopmanCatalogReducer from '@/store/shopman/catalog-slice'
import shopmanCartReducer from '@/store/shopman/cart-slice'
import shopmanPedidosReducer from '@/store/shopman/pedidos-slice'

export const store = configureStore({
    reducer: {
        landing: landingReducer,
        signIn: signInReducer,
        signUp: signUpReducer,
        masters: mastersReducer,
        adminCiudades: adminCiudadesReducer,
        adminCategorias: adminCategoriasReducer,
        adminProductos: adminProductosReducer,
        adminUsuarios: adminUsuariosReducer,
        adminDashboard: adminDashboardReducer,
        proveedorProductos: proveedorProductosReducer,
        proveedorDashboard: proveedorDashboardReducer,
        proveedorPedidos: proveedorPedidosReducer,
        shopmanUser: shopmanUserReducer,
        shopmanCatalog: shopmanCatalogReducer,
        shopmanCart: shopmanCartReducer,
        shopmanPedidos: shopmanPedidosReducer,
    },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
