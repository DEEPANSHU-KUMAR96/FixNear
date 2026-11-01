import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
    deleteInquiry,
    getAllInquiries,
    updateInquiryStatus,
    getAdminStats,
    getAllUsers,
    getAdminAllIssues,
    updateAdminIssueStatus,
    deleteAdminIssue,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protect, adminMiddleware);

// Inquiries
router.get("/inquiries", getAllInquiries);
router.patch("/inquiries/:id/status", updateInquiryStatus);
router.delete("/inquiries/:id", deleteInquiry);

// Stats
router.get("/stats", getAdminStats);

// Users
router.get("/users", getAllUsers);

// Issues (admin-level, no ownership check)
router.get("/issues", getAdminAllIssues);
router.patch("/issues/:id/status", updateAdminIssueStatus);
router.delete("/issues/:id", deleteAdminIssue);

export default router;
