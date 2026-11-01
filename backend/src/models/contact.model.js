import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: /^\S+@\S+\.\S+$/,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: ["Pending", "Reviewed", "Responded"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;