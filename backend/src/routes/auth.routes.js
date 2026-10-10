import { Router } from "express";
import { registerValidator, vailidLoginUser } from "../validators/auth.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

const router = Router();


router.post("/register", registerValidator, registerUser)

router.post('/login', vailidLoginUser, loginUser)

router.post('/logout', protect, logoutUser)

router.get('/me', protect, getUser)


export default router;