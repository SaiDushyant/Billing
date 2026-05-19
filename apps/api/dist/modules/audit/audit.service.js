"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const prisma_1 = require("../../config/prisma");
class AuditService {
    static async log(data) {
        return prisma_1.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                oldData: data.oldData,
                newData: data.newData,
                metadata: data.metadata,
            },
        });
    }
}
exports.AuditService = AuditService;
