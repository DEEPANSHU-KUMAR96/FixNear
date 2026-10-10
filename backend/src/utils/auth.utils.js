import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const sendTokenResponse = async (user, res, message) => {
    const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token);
    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
