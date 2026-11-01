import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/components/ForgotPassword";
import Home from "../pages/Home";
import Issue from "../features/issues/pages/Issue";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/issues",
        element: <Issue />
    },
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
]);

export default router;
