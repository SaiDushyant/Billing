"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
class AuthController {
    static async register(req, res) {
        try {
            const validatedData = auth_validation_1.registerSchema.parse(req.body);
            const result = await auth_service_1.AuthService.register(validatedData.name, validatedData.email, validatedData.password);
            res.status(201).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async login(req, res) {
        try {
            const validatedData = auth_validation_1.loginSchema.parse(req.body);
            const result = await auth_service_1.AuthService.login(validatedData.email, validatedData.password);
            res.json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    static async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const user = await auth_service_1.AuthService.getCurrentUser(req.user.id);
            res.json(user);
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.AuthController = AuthController;
