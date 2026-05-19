import { AuditAction } from "@prisma/client";

import { prisma } from "../../config/prisma";

export class AuditService {
  static async log(data: {
    userId?: string;

    action: AuditAction;

    entityType: string;

    entityId?: string;

    oldData?: any;

    newData?: any;

    metadata?: any;
  }) {
    return prisma.auditLog.create({
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
