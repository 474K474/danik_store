import Admin from "./pages/Admin"
import Cart from "./pages/Cart"
import Shop from "./pages/Shop"
import AuthPage from "./pages/AuthPage"
import ProductPage from "./pages/ProductPage"
import HomePage from "./pages/HomePage"
import { ADMIN_ROUTE, CART_ROUTE, LOGIN_ROUTE, HOME_ROUTE, PRODUCT_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "./utils/consts"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },

    {
        path: CART_ROUTE,
        Component: Cart
    },
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    
    {
        path: LOGIN_ROUTE,
        Component: AuthPage
    },
    
    {
        path: REGISTRATION_ROUTE,
        Component: AuthPage
    },
    
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },

    {
        path: HOME_ROUTE,
        Component: HomePage 
    },

]

