import { AuditAction, Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

export class AuditService {
  // =========================
  // CREATE AUDIT LOG
  // =========================

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

  // =========================
  // GET FILTERED LOGS
  // =========================

  static async getLogs(params: {
    search?: string;

    action?: string;

    entityType?: string;

    startDate?: string;

    endDate?: string;

    page?: number;

    limit?: number;
  }) {
    const page = Number(params.page || 1);

    const limit = Number(params.limit || 10);

    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    // SEARCH
    if (params.search) {
      where.OR = [
        {
          entityType: {
            contains: params.search,
            mode: "insensitive",
          },
        },

        {
          entityId: {
            contains: params.search,
            mode: "insensitive",
          },
        },

        {
          user: {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // ACTION FILTER
    if (params.action && params.action !== "ALL") {
      where.action = params.action as AuditAction;
    }

    // ENTITY FILTER
    if (params.entityType && params.entityType !== "ALL") {
      where.entityType = params.entityType;
    }

    // DATE FILTER
    if (params.startDate || params.endDate) {
      where.createdAt = {};

      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }

      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate);
      }
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,

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

        skip,

        take: limit,
      }),

      prisma.auditLog.count({
        where,
      }),
    ]);

    return {
      items,

      total,

      page,

      totalPages: Math.ceil(total / limit),
    };
  }

  // =========================
  // EXPORT LOGS
  // =========================

  static async exportLogs(params: {
    search?: string;

    action?: string;

    entityType?: string;

    startDate?: string;

    endDate?: string;
  }) {
    const where: Prisma.AuditLogWhereInput = {};

    // SEARCH
    if (params.search) {
      where.OR = [
        {
          entityType: {
            contains: params.search,
            mode: "insensitive",
          },
        },

        {
          entityId: {
            contains: params.search,
            mode: "insensitive",
          },
        },
      ];
    }

    // ACTION
    if (params.action && params.action !== "ALL") {
      where.action = params.action as AuditAction;
    }

    // ENTITY TYPE
    if (params.entityType && params.entityType !== "ALL") {
      where.entityType = params.entityType;
    }

    // DATE RANGE
    if (params.startDate || params.endDate) {
      where.createdAt = {};

      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }

      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate);
      }
    }

    return prisma.auditLog.findMany({
      where,

      include: {
        user: {
          select: {
            name: true,

            email: true,

            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
