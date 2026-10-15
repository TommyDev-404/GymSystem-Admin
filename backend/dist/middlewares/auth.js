import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.admin_token;
        if (!token) {
            throw new AppError("No token provided", 401);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        throw new AppError("Invalid or expired token", 401);
    }
};
