import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { config } from "../config/config.js";
import { clearAuthCookies } from "../utils/auth.utils.js";

export const verifyRefreshToken = async (req, res, next) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Refresh token not found",
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);
    } catch (error) {
        clearAuthCookies(res);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }

    if (typeof decoded === "string" || decoded.type !== "refresh" || !decoded.id) {
        clearAuthCookies(res);
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token",
        });
    }

    let user;
    try {
        user = await User.findById(decoded.id);
    } catch (error) {
        return next(error);
    }

    if (!user) {
        clearAuthCookies(res);
        return res.status(401).json({
            success: false,
            message: "User for refresh token was not found",
        });
    }

    req.user = user;
    return next();
};
