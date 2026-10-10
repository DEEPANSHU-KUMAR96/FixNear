import User from "../models/user.model.js";
import { config } from "../config/config.js"
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    let token = req.cookies.token;
    
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized" });
    }
};