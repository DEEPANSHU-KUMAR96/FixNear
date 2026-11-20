import { classifyIssue } from "../services/ai.service.js";

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