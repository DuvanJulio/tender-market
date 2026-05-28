import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import landingReducer from '@/store/landing/landing-slice'
import signInReducer from '@/store/auth/sign-in-slice'
import signUpReducer from '@/store/auth/sign-up-slice'
import mastersReducer from '@/store/masters/masters-slice'
import adminCiudadesReducer from '@/store/admin/ciudades-slice'
import adminCategoriasReducer from '@/store/admin/categorias-slice'
import adminProductosReducer from '@/store/admin/productos-slice'

export const store = configureStore({
    reducer: {
        landing: landingReducer,
        signIn: signInReducer,
        signUp: signUpReducer,
        masters: mastersReducer,
        adminCiudades: adminCiudadesReducer,
        adminCategorias: adminCategoriasReducer,
        adminProductos: adminProductosReducer,
    },

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
