import User from "../models/user.model.js";
import {
    clearAuthCookies,
    clearAccessTokenCookie,
    createAccessToken,
    sendTokenResponse,
} from "../utils/auth.utils.js";
import { createHash, randomBytes } from "node:crypto";
import {
    isPasswordResetEmailConfigured,
    sendPasswordResetEmail,
} from "../services/email.service.js";

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {

        const isUserAllReadyExisted = await User.findOne({
            $or: [
                { email: email }
            ]
        })

        if (isUserAllReadyExisted) {
            return res.status(400).json({
                message: 'User already existed with this email'
            })
        }


        const user = await User.create({
            name,
            email,
            password,
            role: "user"
        })
        await sendTokenResponse(user, res, "User registered successfully");
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error registering user" });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const user = await User.findOne({
        $or: [
            { email: email }
        ]
    }).select("+password");

    if (!user) {
        return res.status(404).json({
            message: 'user not found with this email'
        })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(400).json({
            message: 'your email and password is invalid'
        })
    }
    await sendTokenResponse(user, res, "User logged in successfully");
}


export const logoutUser = async (req, res) => {
    clearAuthCookies(res);
    res.status(200).json({
        message: 'User logged out successfully'
    })
}

export const getUser = async (req, res) => {
      const user = req.user
    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const refreshToken = async (req, res) => {
    const accessToken = createAccessToken(req.user._id);
    clearAccessTokenCookie(res);

    return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        accessToken,
    });
}


export const forgotPassword = async (req, res) => {
    if (!isPasswordResetEmailConfigured()) {
        return res.status(503).json({
            success: false,
            message: "Password reset email is temporarily unavailable",
        });
    }

    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email, authProvider: "local" });

    if (user) {
        const resetToken = randomBytes(32).toString("hex");
        user.passwordResetToken = createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            try {
                await user.save();
            } catch (cleanupError) {
                console.error("Failed to clear an unsent password reset token:", cleanupError);
            }
            console.error("Failed to send password reset email:", error);
            return res.status(503).json({
                success: false,
                message: "Password reset email is temporarily unavailable",
            });
        }
    }

    return res.status(200).json({
        success: true,
        message: "If an account exists for that email, password reset instructions will be sent.",
    });
};

export const resetPassword = async (req, res) => {
    const tokenHash = createHash("sha256").update(req.body.token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: tokenHash,
        passwordResetExpires: { $gt: new Date() },
        authProvider: "local",
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Reset token is invalid or expired",
        });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    clearAuthCookies(res);

    return res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
};