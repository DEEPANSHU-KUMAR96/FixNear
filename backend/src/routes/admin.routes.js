import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
    deleteInquiry,
    getAllInquiries,
    updateInquiryStatus,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect, adminMiddleware);

router.get("/inquiries", getAllInquiries);

router.patch("/inquiries/:id/status", updateInquiryStatus);

router.delete("/inquiries/:id", deleteInquiry);

export default router