"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
const audit_service_1 = require("../audit/audit.service");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}
class AuthService {
    static async register(name, email, password) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        // AUDIT LOGIN
        await audit_service_1.AuditService.log({
            userId: user.id,
            action: "LOGIN",
            entityType: "AUTH",
        });
        return {
            user,
            token,
        };
    }
    static async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const validPassword = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!validPassword) {
            throw new Error("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return {
            token,
            user,
        };
    }
    static async getCurrentUser(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
exports.AuthService = AuthService;
