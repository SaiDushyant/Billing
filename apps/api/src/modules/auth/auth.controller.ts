import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const result = await AuthService.register(
        validatedData.name,
        validatedData.email,
        validatedData.password,
      );

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await AuthService.login(
        validatedData.email,
        validatedData.password,
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}