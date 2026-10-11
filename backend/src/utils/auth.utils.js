
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const createAccessToken = (userId) =>
    jwt.sign(
        {
            id: userId,
            type: "access",
        },
        config.JWT_SECRET,
        { expiresIn: "30m" }
    );

export const clearAccessTokenCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
};

export const clearAuthCookies = (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    clearAccessTokenCookie(res);
};

export const sendTokenResponse = async (user, res, message) => {
    const accessToken = createAccessToken(user._id);
    clearAccessTokenCookie(res);

    const refreshToken = jwt.sign(
        {
            id: user._id,
            type: "refresh",
        },
        config.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });

    return res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
    });
};
