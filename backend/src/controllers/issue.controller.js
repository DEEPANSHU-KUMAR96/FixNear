import Issue from "../models/issue.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { uploadIssueImage } from "../services/imagekit.service.js";

const uploadImageFromRequest = async (req, res) => {
    if (!req.file) return null;

    try {
        return await uploadIssueImage(req.file);
    } catch (error) {
        console.error("Failed to upload issue image:", error);
        res.status(error.code === "IMAGEKIT_NOT_CONFIGURED" ? 503 : 502).json({
            success: false,
            message: error.code === "IMAGEKIT_NOT_CONFIGURED"
                ? "Image upload is not configured"
                : "Failed to upload issue image",
        });
        return false;
    }
};

export const createIssue = async (req, res) => {
    const { title, description, category, location, status, priority, latitude,
        longitude, } = req.body;

    if (!title || !description || !category || !location) {
        return res.status(400).json({
            success: false,
            message: "Title, description, category, and location are required",
        });
    }
    const hasLatitude = latitude !== undefined && latitude !== "";
    const hasLongitude = longitude !== undefined && longitude !== "";

    if (hasLatitude !== hasLongitude) {
        return res.status(400).json({
            success: false,
            message: "Both latitude and longitude are required together",
        });
    }

    let geoLocation;

    if (hasLatitude && hasLongitude) {
        const lat = Number(latitude);
        const lng = Number(longitude);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            lat < -90 || lat > 90 ||
            lng < -180 || lng > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid geographical coordinates",
            });
        }

        geoLocation = {
            type: "Point",
            coordinates: [lng, lat],
        };
    }


    try {
        const uploadedImage = await uploadImageFromRequest(req, res);
        if (uploadedImage === false) return;

        const issue = await Issue.create({
            title: title ? title.trim() : title,
            description: description ? description.trim() : description,
            category,
            location: location ? location.trim() : location,
            image: uploadedImage?.url,
            status: status || "Reported",
            priority: priority || "Medium",
            ...(geoLocation && { geoLocation }),
            createdBy: req.user._id,
        });

        await Notification.create({
            userId: req.user._id,
            title: "Issue Reported",
            message: `Your complaint "${issue.title}" has been registered successfully.`,
            type: "issue_created",
            issueId: issue._id,
            read: false,
        }).catch(() => { });

        // Also notify all admins about the newly submitted issue
        try {
            const admins = await User.find({ role: "admin" }).select("_id").lean();
            if (admins && admins.length > 0) {
                const adminNotifications = admins
                    .filter((admin) => String(admin._id) !== String(req.user._id))
                    .map((admin) => ({
                        userId: admin._id,
                        title: "New Civic Issue Reported",
                        message: `New complaint "${issue.title}" reported at ${issue.location} (${issue.category}).`,
                        type: "issue_created",
                        issueId: issue._id,
                        read: false,
                    }));
                if (adminNotifications.length > 0) {
                    await Notification.insertMany(adminNotifications);
                }
            }
        } catch (adminNotifErr) {
            console.error("Failed to notify admins of new issue:", adminNotifErr);
        }

        return res.status(201).json({
            success: true,
            message: "Issue created successfully",
            issue,
        });
    } catch (error) {
        console.error("Failed to create issue:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. '),
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error creating issue",
        });
    }
};

export const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().sort({ _id: -1 }).populate("createdBy", "name email");

        if (!issues) {
            return res.status(404).json({
                success: false,
                message: "No issues found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "All issues fetched successfully",
            issues,
        });
    } catch (error) {
        console.error("Failed to fetch all issues:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching all issues",
        });
    }
};

export const getIssue = async (req, res) => {
    try {
        const issues = await Issue.find({ createdBy: req.user._id }).sort({ _id: -1 });

        if (!issues) {
            return res.status(404).json({
                success: false,
                message: "No issues found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Issues fetched successfully",
            issues,
        });
    } catch (error) {
        console.error("Failed to get issues:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting issues",
        });
    }
};

export const getSingleIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id).populate("createdBy", "name email");
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
};

export const updateIssue = async (req, res) => {
    const updates = req.body;
    const allowedFields = req.user?.role === "admin"
        ? ["title", "description", "category", "location", "status", "priority"]
        : ["title", "description", "category", "location", "priority"];

    if (!updates || typeof updates !== "object" || Array.isArray(updates) ||
        (!allowedFields.some((field) => Object.hasOwn(updates, field)) && !req.file)) {
        return res.status(400).json({
            success: false,
            message: "At least one issue field is required",
        });
    }

    try {
        const issue = await Issue.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found or unauthorized",
            });
        }

        const uploadedImage = await uploadImageFromRequest(req, res);
        if (uploadedImage === false) return;

        for (const field of allowedFields) {
            if (Object.hasOwn(updates, field)) {
                issue[field] = updates[field];
            }
        }
        if (uploadedImage) {
            issue.image = uploadedImage.url;
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
        });

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete issue:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting issue",
        });
    }
};

export const updateIssueStatus = async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only admin can change issue status.",
        });
    }

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

        if (issue.createdBy) {
            const citizenId = issue.createdBy._id || issue.createdBy;
            let notifMessage = `Your complaint is now ${status}.`;
            if (status === "In Progress") {
                notifMessage = "Your complaint is now In Progress.";
            } else if (status === "Resolved") {
                notifMessage = "Your complaint has been successfully resolved.";
            }

            await Notification.create({
                userId: citizenId,
                title: issue.title ? `Issue Updated: ${issue.title}` : "Issue Status Updated",
                message: notifMessage,
                type: "status_change",
                issueId: issue._id,
                read: false,
            }).catch(() => { });
        }

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

        const issues = await Issue.find(filter).sort({ _id: -1 });
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

export const toggleUpvoteIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        const userId = req.user._id;

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        if (!Array.isArray(issue.upvotes)) {
            issue.upvotes = [];
        }

        const upvoteIndex = issue.upvotes.findIndex(
            (id) => id.toString() === userId.toString()
        );

        let isUpvoted = false;
        if (upvoteIndex > -1) {
            issue.upvotes.splice(upvoteIndex, 1);
            isUpvoted = false;
        } else {
            issue.upvotes.push(userId);
            isUpvoted = true;
        }

        issue.upvotesCount = issue.upvotes.length;
        await issue.save();

        if (isUpvoted && issue.createdBy && issue.createdBy.toString() !== userId.toString()) {
            await Notification.create({
                userId: issue.createdBy,
                title: "New Upvote Received",
                message: `Your issue "${issue.title}" received a new community upvote.`,
                type: "upvote",
                issueId: issue._id,
                read: false,
            }).catch(() => { });
        }

        await issue.populate("createdBy", "name email");

        return res.status(200).json({
            success: true,
            message: isUpvoted ? "Issue upvoted successfully" : "Upvote removed successfully",
            isUpvoted,
            upvotesCount: issue.upvotesCount,
            issue,
        });
    } catch (error) {
        console.error("Failed to toggle upvote:", error);
        return res.status(500).json({
            success: false,
            message: "Error processing upvote",
        });
    }
};
