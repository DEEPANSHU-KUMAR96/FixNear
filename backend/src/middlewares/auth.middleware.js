import User from "../models/user.model.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] || req.cookies?.token || req.cookies?.accessToken;

    if (!bearerToken) {
        return res.status(401).json({
            message: "Not authorized. Please log in."
        });
    }
    try {
        const decoded = jwt.verify(bearerToken, config.JWT_SECRET);
        if (typeof decoded === "string" || !decoded.id || decoded.type === "refresh") {
            return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User account no longer exists." });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed. Please log in." });
    }
};
