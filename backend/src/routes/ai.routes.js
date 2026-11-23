import express from "express";

import {
    classifyIssueController,
    checkDuplicateIssuesController,
} from "../controllers/ai.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/classify-issue",
    protect,
    classifyIssueController
);

router.post(
    "/check-duplicates",
    protect,
    checkDuplicateIssuesController
);

export default router;