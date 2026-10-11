import { Router } from "express";
import {
    forgotPasswordValidator,
    registerValidator,
    resetPasswordValidator,
    vailidLoginUser,
} from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { verifyRefreshToken } from "../middlewares/refresh.middleware.js";
import {
    forgotPassword,
    getUser,
    loginUser,
    logoutUser,
    refreshToken,
    registerUser,
    resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();


router.post("/register", registerValidator, registerUser)

router.post('/login', vailidLoginUser, loginUser)

router.post('/logout', logoutUser)

router.get('/me', protect, getUser)

router.get('/refresh-token', verifyRefreshToken, refreshToken)

router.post("/forgot-password", forgotPasswordValidator, forgotPassword)

router.post("/reset-password", resetPasswordValidator, resetPassword)

export default router;