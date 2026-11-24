import Notification from "../models/notification.model.js";
import Issue from "../models/issue.model.js";
import Contact from "../models/contact.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        let notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();

        // If no notifications exist yet, backfill
        if (notifications.length === 0) {
            if (req.user.role === "admin") {
                // Admin backfill: recent platform issues and contact inquiries
                const [recentIssues, recentContacts] = await Promise.all([
                    Issue.find().sort({ createdAt: -1 }).limit(10).lean(),
                    Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
                ]);

                const backfillDocs = [];
                for (const issue of recentIssues) {
                    backfillDocs.push({
                        userId,
                        title: "Civic Issue Reported",
                        message: `Complaint "${issue.title}" at ${issue.location} (${issue.category}) - ${issue.status}.`,
                        type: "issue_created",
                        issueId: issue._id,
                        read: false,
                        createdAt: issue.createdAt || new Date(),
                    });
                }

                for (const contact of recentContacts) {
                    backfillDocs.push({
                        userId,
                        title: "Citizen Inquiry",
                        message: `${contact.name} (${contact.email}): "${contact.message?.slice(0, 50)}${contact.message?.length > 50 ? "..." : ""}"`,
                        type: "general",
                        read: false,
                        createdAt: contact.createdAt || new Date(),
                    });
                }

                if (backfillDocs.length > 0) {
                    await Notification.insertMany(backfillDocs).catch(() => {});
                    notifications = await Notification.find({ userId })
                        .sort({ createdAt: -1 })
                        .limit(30)
                        .lean();
                }
            } else {
                // Citizen backfill: their own reported issues
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
                        await Notification.insertMany(backfillDocs).catch(() => {});
                        notifications = await Notification.find({ userId })
                            .sort({ createdAt: -1 })
                            .limit(30)
                            .lean();
                    }
                }
            }
        }

        const unreadCount = notifications.filter((n) => !n.read).length;

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
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

