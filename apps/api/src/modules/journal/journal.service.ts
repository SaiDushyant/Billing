import { AccountType, JournalType, Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

export class JournalService {
  // =========================
  // CREATE JOURNAL ENTRY
  // =========================

  static async createEntry(
    data: {
      documentId?: string;

      type: JournalType;

      description?: string;

      totalAmount: number;

      createdById?: string;

      lines: {
        account: AccountType;

        debit?: number;

        credit?: number;

        notes?: string;
      }[];
    },

    tx?: Prisma.TransactionClient,
  ) {
    const db = tx || prisma;

    const totalDebit = data.lines.reduce(
      (sum, line) => sum + (line.debit || 0),
      0,
    );

    const totalCredit = data.lines.reduce(
      (sum, line) => sum + (line.credit || 0),
      0,
    );

    // DOUBLE ENTRY VALIDATION
    if (totalDebit !== totalCredit) {
      throw new Error("Journal entry is not balanced");
    }

    return db.journalEntry.create({
      data: {
        documentId: data.documentId,

        type: data.type,

        description: data.description,

        totalAmount: new Prisma.Decimal(data.totalAmount),

        createdById: data.createdById,

        lines: {
          create: data.lines.map((line) => ({
            account: line.account,

            debit: new Prisma.Decimal(line.debit || 0),

            credit: new Prisma.Decimal(line.credit || 0),

            notes: line.notes,
          })),
        },
      },

      include: {
        lines: true,
      },
    });
  }
}
