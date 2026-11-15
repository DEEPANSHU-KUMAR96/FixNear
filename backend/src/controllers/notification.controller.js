import Notification from "../models/notification.model.js";
import Issue from "../models/issue.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        let notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();

        // If no notifications exist yet, backfill from user's actual issues
        if (notifications.length === 0) {
            const userIssues = await Issue.find({ createdBy: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            if (userIssues.length > 0) {
                const backfillDocs = [];
                for (const issue of userIssues) {
                    if (issue.status && issue.status !== "Reported") {
                        backfillDocs.push({
                            userId,
                            title: "Issue Status Updated",
                            message: `Your complaint "${issue.title}" is marked as "${issue.status}".`,
                            type: "status_change",
                            issueId: issue._id,
                            read: false,
                            createdAt: issue.updatedAt || issue.createdAt || new Date(),
                        });
                    }
                    backfillDocs.push({
                        userId,
                        title: "Issue Reported",
                        message: `Your complaint "${issue.title}" was submitted successfully.`,
                        type: "issue_created",
                        issueId: issue._id,
                        read: true,
                        createdAt: issue.createdAt || new Date(),
                    });
                }

                if (backfillDocs.length > 0) {
                    await Notification.insertMany(backfillDocs);
                    notifications = await Notification.find({ userId })
                        .sort({ createdAt: -1 })
                        .limit(30)
                        .lean();
                }
            }
        }

        const unreadCount = notifications.filter((n) => !n.read).length;

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching notifications",
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, read: false },
            { $set: { read: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating notifications",
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating notification",
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting notification",
        });
    }
};

