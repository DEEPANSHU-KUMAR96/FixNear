import Issue from "../models/issue.model.js";


export const createIssue = async (req, res) => {
    const { title, description, category, location, status, priority } = req.body;

    try {
        const issue = await Issue.create({
            title,
            description,
            category,
            location,
            status,
            priority,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Issue created successfully",
            issue,
        });
    } catch (error) {
        console.error("Failed to create issue:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating issue",
        });
    }
};


export const getIssue = async (req, res) => {
    try {
        const issues = await Issue.find({ createdBy: req.user._id });
        return res.status(200).json({
            success: true,
            message: "Issues fetched successfully",
            issues,
        });
        if (!issues) {
            return res.status(404).json({
                success: false,
                message: "Issues not found",
            });
        }
    } catch (error) {
        console.error("Failed to get issues:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting issues",
        });
    }
}


export const getSingleIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Issue fetched successfully",
            issue,
        });
    } catch (error) {
        console.error("Failed to get issue:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting issue",
        });
    }
}

export const updateIssue = async (req, res) => {
    const updates = req.body;
    const allowedFields = ["title", "description", "category", "location", "status", "priority"];

    if (!updates || typeof updates !== "object" || Array.isArray(updates) ||
        !allowedFields.some((field) => Object.hasOwn(updates, field))) {
        return res.status(400).json({
            success: false,
            message: "At least one issue field is required",
        });
    }

    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        for (const field of allowedFields) {
            if (Object.hasOwn(updates, field)) {
                issue[field] = updates[field];
            }
        }

        await issue.save();
        return res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            issue,
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid issue update",
                error: error.message,
            });
        }

        console.error("Failed to update issue:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating issue",
        });
    }
};

export const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id,
        })

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not find"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Issue deleted succesfully"
        })
    } catch (error) {
        console.error("Failed to delete issue:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting issue",
        });
    }

}

export const updateIssueStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Reported",
            "In Progress",
            "Resolved",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue status",
            });
        }

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        issue.status = status;

        issue.history.push({
            status,
            changedAt: new Date(),
        });

        await issue.save();

        return res.status(200).json({
            success: true,
            message: "Issue status updated successfully",
            issue,
        });

    } catch (error) {
        console.error("Failed to update issue status:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating issue status",
        });
    }
};

export const searchIssues = async (req, res) => {
    const { search } = req.query;

    if (search !== undefined && (typeof search !== "string" || search.length > 100)) {
        return res.status(400).json({
            success: false,
            message: "Search must be a string of 100 characters or fewer",
        });
    }

    try {
        const filter = { createdBy: req.user._id };
        const normalizedSearch = search?.trim();

        if (normalizedSearch) {
            const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const searchCondition = { $regex: escapedSearch, $options: "i" };

            filter.$or = [
                { title: searchCondition },
                { description: searchCondition },
                { category: searchCondition },
                { location: searchCondition },
                { status: searchCondition },
                { priority: searchCondition },
            ];
        }

        const issues = await Issue.find(filter);
        return res.status(200).json({
            success: true,
            message: "Issues fetched successfully",
            issues,
        });
    } catch (error) {
        console.error("Failed to search issues:", error);
        return res.status(500).json({
            success: false,
            message: "Error searching issues",
        });
    }
};