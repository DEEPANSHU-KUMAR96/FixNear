import express from "express";

import {
    classifyIssueController,
} from "../controllers/ai.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/classify-issue",
    protect,
    classifyIssueController
);

export default router;