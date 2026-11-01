import Contact from "../models/contact.model.js";

export const createContact = async (req, res) => {
    const { name, email, message } = req.body ?? {};
    const contactDetails = {
        name: typeof name === "string" ? name.trim() : "",
        email: typeof email === "string" ? email.trim().toLowerCase() : "",
        message: typeof message === "string" ? message.trim() : "",
    };

    if (
        contactDetails.name.length < 1 ||
        contactDetails.name.length > 100 ||
        contactDetails.email.length > 254 ||
        !/^\S+@\S+\.\S+$/.test(contactDetails.email) ||
        contactDetails.message.length < 1 ||
        contactDetails.message.length > 5000
    ) {
        return res.status(400).json({
            success: false,
            message: "Provide a valid name, email address, and message (up to 5000 characters).",
        });
    }

    try {
        const contact = await Contact.create(contactDetails);

        return res.status(201).json({
            success: true,
            message: "Contact created successfully",
            contact,
        });
    } catch (error) {
        console.error("Failed to create contact:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Provide valid contact details.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create contact",
        });
    }
};