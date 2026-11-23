import { classifyIssue } from "../services/ai.service.js";
import { findDuplicateIssues } from "../services/duplicate.service.js";

const allowedCategories = [
    "Garbage",
    "Road",
    "Streetlight",
    "Water",
    "Pothole",
    "Sanitation",
];

export const classifyIssueController = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Input validation
        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            !title.trim() ||
            !description.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        if (title.length > 150 || description.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Input exceeds allowed length",
            });
        }

        const result = await classifyIssue({
            title: title.trim(),
            description: description.trim(),
        });
        

        return res.status(200).json({
            success: true,
            message: "Issue classified successfully",
            classification: result,
        });

    } catch (error) {
        console.error("AI classification error:", error);

        return res.status(502).json({
            success: false,
            message: "Unable to classify issue right now",
        });
    }
};

export const checkDuplicateIssuesController = async (req, res) => {
    try {
        const { title, description, category, location, excludeIssueId } = req.body;

        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof category !== "string" ||
            typeof location !== "string" ||
            !title.trim() ||
            !description.trim() ||
            !category.trim() ||
            !location.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category and location are required",
            });
        }

        const safeTitle = title.trim().slice(0, 100);
        const safeDescription = description.trim().slice(0, 1000);

        if (!allowedCategories.includes(category.trim())) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue category",
            });
        }

        const result = await findDuplicateIssues({
            title: safeTitle,
            description: safeDescription,
            category: category.trim(),
            location: location.trim(),
            excludeIssueId: excludeIssueId ? String(excludeIssueId).trim() : undefined,
        });

        return res.status(200).json({
            success: true,
            message: result.hasDuplicates
                ? "Potential duplicate issues found"
                : "No duplicate issues found",
            ...result,
        });
    } catch (error) {
        console.error("AI duplicate detection error:", error);

        return res.status(502).json({
            success: false,
            message: "Unable to check duplicate issues right now",
        });
    }
};