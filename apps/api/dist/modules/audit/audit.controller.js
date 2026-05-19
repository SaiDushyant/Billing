"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const prisma_1 = require("../../config/prisma");
class AuditController {
    static async getLogs(_, res) {
        try {
            const logs = await prisma_1.prisma.auditLog.findMany({
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
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}
exports.AuditController = AuditController;
