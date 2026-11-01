import mongoose from "mongoose";
import Contact from "../models/contact.model.js";
import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";

const inquiryStatuses = ["Pending", "Reviewed", "Responded"];
const issueStatuses = ["Reported", "In Progress", "Resolved"];

// ── Existing inquiry handlers ──────────────────────────────────────────────────

export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Contact.find().sort({ createdAt: -1 });

        if (!inquiries) {
            return res.status(404).json({
                success: false,
                message: "No inquiries found",
            });
        }
        return res.status(200).json({
            success: true,
            inquiries,
        });
    } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch inquiries",
        });
    }
};

export const updateInquiryStatus = async (req, res) => {
    const { status } = req.body;
    if (!inquiryStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid inquiry status",
        });
    }

    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid inquiry ID",
        });
    }

    try {
        const inquiry = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Inquiry status updated successfully",
            inquiry,
        });
    } catch (error) {
        console.error("Failed to update inquiry status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update inquiry status",
        });
    }
};

export const deleteInquiry = async (req, res) => {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid inquiry ID",
        });
    }

    try {
        const inquiry = await Contact.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Inquiry deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete inquiry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete inquiry",
        });
    }
};

// ── New admin endpoints ────────────────────────────────────────────────────────

export const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalIssues, pendingInquiries, resolvedIssues, inProgressIssues, reportedIssues] =
            await Promise.all([
                User.countDocuments(),
                Issue.countDocuments(),
                Contact.countDocuments({ status: "Pending" }),
                Issue.countDocuments({ status: "Resolved" }),
                Issue.countDocuments({ status: "In Progress" }),
                Issue.countDocuments({ status: "Reported" }),
            ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalIssues,
                pendingInquiries,
                resolvedIssues,
                inProgressIssues,
                reportedIssues,
            },
        });
    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin stats",
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("name email role createdAt avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

export const getAdminAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            issues,
        });
    } catch (error) {
        console.error("Failed to fetch issues:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch issues",
        });
    }
};

export const updateAdminIssueStatus = async (req, res) => {
    const { status } = req.body;

    if (!issueStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid issue status",
        });
    }

    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid issue ID",
        });
    }

    try {
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate("createdBy", "name email");

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
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
            message: "Failed to update issue status",
        });
    }
};

export const deleteAdminIssue = async (req, res) => {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid issue ID",
        });
    }

    try {
        const issue = await Issue.findByIdAndDelete(req.params.id);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete issue:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete issue",
        });
    }
};
