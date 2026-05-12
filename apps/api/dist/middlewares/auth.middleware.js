"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}
