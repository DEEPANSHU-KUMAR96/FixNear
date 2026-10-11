import User from "../models/user.model.js";
import { config } from "../config/config.js"
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!bearerToken) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }
    try {
        const decoded = jwt.verify(bearerToken, config.JWT_SECRET);
        if (typeof decoded === "string" || !decoded.id || decoded.type === "refresh") {
            return res.status(401).json({ message: "Not authorized" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized" });
    }
};