import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

export class DocumentTimelineService {
  static async createEvent(
    data: {
      documentId: string;

      userId?: string;

      type:
        | "CREATED"
        | "UPDATED"
        | "CANCELLED"
        | "RETURNED"
        | "PARTIAL_RETURN"
        | "PAYMENT_ADDED"
        | "PAYMENT_REFUNDED"
        | "CONVERTED"
        | "APPROVED"
        | "REJECTED"
        | "REBILLED";

      message: string;

      metadata?: Prisma.JsonValue;
    },

    tx?: Prisma.TransactionClient,
  ) {
    const db = tx || prisma;

    return db.documentTimeline.create({
      data: {
        documentId: data.documentId,

        userId: data.userId,

        type: data.type,

        message: data.message,

        metadata: data.metadata ?? Prisma.JsonNull,
      },
    });
  }
}
