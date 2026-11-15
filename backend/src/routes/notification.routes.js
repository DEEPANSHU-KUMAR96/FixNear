import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", protect, getNotifications);
router.patch("/read-all", protect, markAllAsRead);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;

