import mongoose from "mongoose";
import Contact from "../models/contact.model.js";

const inquiryStatuses = ["Pending", "Reviewed", "Responded"];

export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Contact.find().sort({ createdAt: -1 });

        if(!inquiries) {
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