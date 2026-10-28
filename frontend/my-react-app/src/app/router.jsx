import { createBrowserRouter, Outlet } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/components/ForgotPassword";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Outlet />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            }
        ]
    }
])

export default router
