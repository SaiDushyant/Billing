import { Request, Response } from "express";

import { prisma } from "../../config/prisma";

export class AuditController {
  static async getLogs(_: Request, res: Response) {
    try {
      const logs = await prisma.auditLog.findMany({
        include: {
          user: {
            select: {
              id: true,

              name: true,

              email: true,

              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 100,
      });

      res.json(logs);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
