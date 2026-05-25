import { DocumentType, Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

import { InventoryService } from "../inventory/inventory.service";

import { DocumentTimelineService } from "./document-timeline.service";

import { calculateGSTAmount } from "./documents.utils";

import { calculateSellingPrice } from "../../utils/pricing";

import { AuditService } from "../audit/audit.service";

import { JournalService } from "../journal/journal.service";

export class DocumentsService {
  static async createDocument(
    data: {
      type: DocumentType;

      billingUserId?: string;

      customerId?: string;

      customerName?: string;

      customerPhone?: string;

      customerEmail?: string;

      customerAddress?: string;

      customerGSTNumber?: string;

      items: {
        variantId: string;
        quantity: number;
      }[];

      payments?: {
        amount: number;

        method: string;

        referenceNumber?: string;

        notes?: string;
      }[];
    },

    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      let subtotal = 0;

      let gstTotal = 0;

      const processedItems = [];

      // =========================
      // PROCESS ITEMS
      // =========================

      for (const item of data.items) {
        const variant = await tx.productVariant.findUnique({
          where: {
            id: item.variantId,
          },
        });

        if (!variant) {
          throw new Error("Variant not found");
        }

        if (data.type === "INVOICE" || data.type === "BILL") {
          await InventoryService.validateStock(variant.id, item.quantity);
        }

        const unitPrice = calculateSellingPrice(
          Number(variant.costPrice),
          Number(variant.profitMargin),
        );

        const lineAmount = unitPrice * item.quantity;

        const gstAmount = calculateGSTAmount(
          lineAmount,
          Number(variant.gstRate),
        );

        subtotal += lineAmount;

        gstTotal += gstAmount;

        processedItems.push({
          variant,

          quantity: item.quantity,

          unitPrice,

          gstRate: Number(variant.gstRate),

          lineTotal: lineAmount + gstAmount,
        });
      }

      // =========================
      // TOTALS
      // =========================

      const grandTotal = subtotal + gstTotal;

      // =========================
      // PAYMENT ENGINE
      // =========================

      const paidAmount =
        data.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      const dueAmount = grandTotal - paidAmount;

      const isPaid = dueAmount <= 0;

      // =========================
      // VALIDATION
      // =========================

      if (paidAmount > grandTotal) {
        throw new Error("Paid amount exceeds invoice total");
      }

      // =========================
      // CREATE DOCUMENT
      // =========================

      const document = await tx.document.create({
        data: {
          type: data.type,

          status: data.type === "DRAFT" ? "DRAFT" : "COMPLETED",

          customerId: data.customerId,

          customerName: data.customerName,

          customerPhone: data.customerPhone,

          customerEmail: data.customerEmail,

          customerAddress: data.customerAddress,

          customerGSTNumber: data.customerGSTNumber,

          subtotal: new Prisma.Decimal(subtotal),

          gstTotal: new Prisma.Decimal(gstTotal),

          grandTotal: new Prisma.Decimal(grandTotal),

          paidAmount: new Prisma.Decimal(paidAmount),

          dueAmount: new Prisma.Decimal(dueAmount),

          isPaid,

          createdById: data.billingUserId || userId,
        },
      });

      // =========================
      // CREATE ITEMS
      // =========================

      for (const item of processedItems) {
        await tx.documentItem.create({
          data: {
            documentId: document.id,

            variantId: item.variant.id,

            quantity: item.quantity,

            unitPrice: new Prisma.Decimal(item.unitPrice),

            gstRate: new Prisma.Decimal(item.gstRate),

            lineTotal: new Prisma.Decimal(item.lineTotal),
          },
        });

        // =========================
        // INVENTORY REDUCTION
        // =========================

        if (data.type === "INVOICE" || data.type === "BILL") {
          await tx.stockMovement.create({
            data: {
              variantId: item.variant.id,

              type: "SALE",

              quantity: item.quantity,

              referenceId: document.id,

              notes: `${data.type} Sale`,
            },
          });

          await tx.productVariant.update({
            where: {
              id: item.variant.id,
            },

            data: {
              currentStock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // =========================
      // CREATE PAYMENTS
      // =========================

      if (data.payments && data.payments.length > 0) {
        for (const payment of data.payments) {
          // VALIDATE PAYMENT
          if (payment.amount <= 0) {
            throw new Error("Invalid payment amount");
          }

          await tx.payment.create({
            data: {
              documentId: document.id,

              amount: new Prisma.Decimal(payment.amount),

              method: payment.method,

              referenceNumber: payment.referenceNumber,

              notes: payment.notes,

              status: paidAmount >= grandTotal ? "PAID" : "PARTIAL",
            },
          });
        }
      }

      // =========================
      // AUDIT LOG
      // =========================

      await AuditService.log({
        userId,

        action: "SALE",

        entityType: "DOCUMENT",

        entityId: document.id,

        newData: {
          type: document.type,

          total: Number(document.grandTotal),

          paidAmount,

          dueAmount,
        },
      });

      // =========================
      // TIMELINE EVENT
      // =========================

      await DocumentTimelineService.createEvent(
        {
          documentId: document.id,

          userId,

          type: "CREATED",

          message: `${data.type} document created`,

          metadata: {
            total: grandTotal,

            items: processedItems.length,

            paidAmount,

            dueAmount,

            isPaid,
          },
        },

        tx,
      );

      // =========================
      // SALES JOURNAL
      // =========================

      await JournalService.createEntry(
        {
          documentId: document.id,

          type: "SALE",

          description: `${data.type} Sale`,

          totalAmount: grandTotal,

          createdById: userId,

          lines: [
            {
              account: "RECEIVABLE",

              debit: grandTotal,
            },

            {
              account: "SALES",

              credit: subtotal,
            },

            {
              account: "GST",

              credit: gstTotal,
            },
          ],
        },

        tx,
      );

      return document;
    });
  }

  static async cancelDocument(documentId: string, userId?: string) {
    return prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id: documentId,
        },

        include: {
          items: true,
        },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      if (document.status === "CANCELLED") {
        throw new Error("Already cancelled");
      }

      for (const item of document.items) {
        // STOCK REVERSAL ENTRY
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,

            type: "RETURN",

            quantity: item.quantity,

            referenceId: document.id,

            notes: "Invoice cancellation stock reversal",
          },
        });

        // RESTORE STOCK
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },

          data: {
            currentStock: {
              increment: item.quantity,
            },
          },
        });
      }

      const updatedDocument = await tx.document.update({
        where: {
          id: document.id,
        },

        data: {
          status: "CANCELLED",
        },
      });

      // MARK PAYMENTS REFUNDED
      await tx.payment.updateMany({
        where: {
          documentId: document.id,
        },

        data: {
          isRefunded: true,
        },
      });

      // AUDIT LOG
      await AuditService.log({
        userId,

        action: "CANCEL",

        entityType: "DOCUMENT",

        entityId: document.id,

        metadata: {
          status: "CANCELLED",
        },
      });

      await DocumentTimelineService.createEvent({
        documentId: document.id,

        userId,

        type: "CANCELLED",

        message: "Document cancelled",

        metadata: {
          total: Number(document.grandTotal),
        },
      });

      return updatedDocument;
    });
  }

  static async returnDocument(
    documentId: string,
    reason: string,
    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id: documentId,
        },

        include: {
          items: true,
        },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      if (document.status === "RETURNED") {
        throw new Error("Already returned");
      }

      for (const item of document.items) {
        // CREATE RETURN STOCK ENTRY
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,

            type: "RETURN",

            quantity: item.quantity,

            referenceId: document.id,

            notes: `Returned Invoice: ${reason}`,
          },
        });

        // RESTORE STOCK
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },

          data: {
            currentStock: {
              increment: item.quantity,
            },
          },
        });
      }

      const updatedDocument = await tx.document.update({
        where: {
          id: document.id,
        },

        data: {
          status: "RETURNED",
        },
      });

      // MARK PAYMENTS REFUNDED
      await tx.payment.updateMany({
        where: {
          documentId: document.id,
        },

        data: {
          isRefunded: true,
        },
      });

      // AUDIT LOG
      await AuditService.log({
        userId,

        action: "UPDATE",

        entityType: "DOCUMENT_RETURN",

        entityId: document.id,

        metadata: {
          status: "RETURNED",

          reason,
        },
      });

      await DocumentTimelineService.createEvent({
        documentId: document.id,

        userId,

        type: "RETURNED",

        message: "Document returned",

        metadata: {
          reason,
        },
      });

      return updatedDocument;
    });
  }

  static async getDocumentById(id: string) {
    const document = await prisma.document.findUnique({
      where: {
        id,
      },

      include: {
        customer: true,

        createdBy: {
          select: {
            id: true,

            name: true,

            role: true,
          },
        },

        rebillFrom: true,

        rebills: {
          select: {
            id: true,

            type: true,

            status: true,

            createdAt: true,
          },
        },

        items: {
          include: {
            variant: true,

            returns: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },

        payments: {
          orderBy: {
            createdAt: "asc",
          },
        },

        itemReturns: {
          include: {
            documentItem: {
              include: {
                variant: true,
              },
            },

            createdBy: {
              select: {
                id: true,

                name: true,

                role: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },

        timeline: {
          include: {
            user: {
              select: {
                id: true,

                name: true,

                role: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    return {
      id: document.id,

      type: document.type,

      status: document.status,

      customerId: document.customerId,

      customerName: document.customerName,

      customerPhone: document.customerPhone,

      customerEmail: document.customerEmail,

      customerAddress: document.customerAddress,

      customerGSTNumber: document.customerGSTNumber,

      subtotal: Number(document.subtotal),

      gstTotal: Number(document.gstTotal),

      grandTotal: Number(document.grandTotal),

      paidAmount: Number(document.paidAmount),

      dueAmount: Number(document.dueAmount),

      isPaid: document.isPaid,

      createdAt: document.createdAt,

      createdBy: document.createdBy
        ? {
            id: document.createdBy.id,

            name: document.createdBy.name,

            role: document.createdBy.role,
          }
        : null,

      rebillFrom: document.rebillFrom
        ? {
            id: document.rebillFrom.id,

            type: document.rebillFrom.type,

            status: document.rebillFrom.status,
          }
        : null,

      rebills: document.rebills.map((rebill) => ({
        id: rebill.id,

        type: rebill.type,

        status: rebill.status,

        createdAt: rebill.createdAt,
      })),

      items: document.items.map((item) => ({
        id: item.id,

        quantity: item.quantity,

        unitPrice: Number(item.unitPrice),

        gstRate: Number(item.gstRate),

        lineTotal: Number(item.lineTotal),

        variant: {
          id: item.variant.id,

          displayName: item.variant.displayName,

          sku: item.variant.sku,

          barcode: item.variant.barcode,
        },
      })),

      payments: document.payments.map((payment) => ({
        id: payment.id,

        amount: Number(payment.amount),

        refundAmount: payment.refundAmount ? Number(payment.refundAmount) : 0,

        method: payment.method,

        referenceNumber: payment.referenceNumber,

        notes: payment.notes,

        status: payment.status,

        isRefunded: payment.isRefunded,

        createdAt: payment.createdAt,
      })),

      itemReturns: document.itemReturns.map((itemReturn) => ({
        id: itemReturn.id,

        quantity: itemReturn.quantity,

        refundAmount: Number(itemReturn.refundAmount),

        reason: itemReturn.reason,

        notes: itemReturn.notes,

        createdAt: itemReturn.createdAt,

        createdBy: itemReturn.createdBy
          ? {
              id: itemReturn.createdBy.id,

              name: itemReturn.createdBy.name,

              role: itemReturn.createdBy.role,
            }
          : null,

        documentItem: {
          id: itemReturn.documentItem.id,

          quantity: itemReturn.documentItem.quantity,

          variant: {
            id: itemReturn.documentItem.variant.id,

            displayName: itemReturn.documentItem.variant.displayName,

            sku: itemReturn.documentItem.variant.sku,

            barcode: itemReturn.documentItem.variant.barcode,
          },
        },
      })),

      timeline: document.timeline.map((event) => ({
        id: event.id,

        type: event.type,

        message: event.message,

        metadata: event.metadata,

        createdAt: event.createdAt,

        user: event.user
          ? {
              id: event.user.id,

              name: event.user.name,

              role: event.user.role,
            }
          : null,
      })),
    };
  }

  static async getAllDocuments(filters: {
    search?: string;

    type?: string;

    status?: string;

    startDate?: string;

    endDate?: string;

    page: number;

    limit: number;
  }) {
    const { search, type, status, startDate, endDate, page, limit } = filters;

    const where: Prisma.DocumentWhereInput = {};

    // SEARCH
    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,

            mode: "insensitive",
          },
        },

        {
          customerPhone: {
            contains: search,
          },
        },

        {
          id: {
            contains: search,

            mode: "insensitive",
          },
        },
      ];
    }

    // TYPE FILTER
    if (type && type !== "ALL") {
      where.type = type as Prisma.EnumDocumentTypeFilter;
    }

    // STATUS FILTER
    if (status && status !== "ALL") {
      where.status = status as Prisma.EnumDocumentStatusFilter;
    }

    // DATE FILTER
    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const total = await prisma.document.count({
      where,
    });

    const documents = await prisma.document.findMany({
      where,

      include: {
        customer: true,

        createdBy: {
          select: {
            id: true,

            name: true,

            role: true,
          },
        },

        rebillFrom: {
          select: {
            id: true,

            type: true,
          },
        },

        items: true,

        payments: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (page - 1) * limit,

      take: limit,
    });

    return {
      items: documents.map((document) => ({
        id: document.id,

        type: document.type,

        status: document.status,

        customerName:
          document.customerName ||
          document.customer?.name ||
          "Walk-in Customer",

        customerPhone: document.customerPhone,

        grandTotal: Number(document.grandTotal),

        subtotal: Number(document.subtotal),

        gstTotal: Number(document.gstTotal),

        paidAmount: Number(document.paidAmount),

        dueAmount: Number(document.dueAmount),

        isPaid: document.isPaid,

        createdAt: document.createdAt,

        createdBy: document.createdBy
          ? {
              id: document.createdBy.id,

              name: document.createdBy.name,

              role: document.createdBy.role,
            }
          : null,

        rebillFrom: document.rebillFrom
          ? {
              id: document.rebillFrom.id,

              type: document.rebillFrom.type,
            }
          : null,

        itemCount: document.items.length,

        paymentCount: document.payments.length,
      })),

      total,

      page,

      totalPages: Math.ceil(total / limit),
    };
  }

  static async convertQuotationToInvoice(quotationId: string, userId?: string) {
    const quotation = await prisma.document.findUnique({
      where: {
        id: quotationId,
      },

      include: {
        items: true,
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    if (quotation.type !== "QUOTATION") {
      throw new Error("Document is not a quotation");
    }

    const invoice = await this.createDocument(
      {
        type: "INVOICE",

        customerId: quotation.customerId || undefined,

        customerName: quotation.customerName || undefined,

        customerPhone: quotation.customerPhone || undefined,

        customerEmail: quotation.customerEmail || undefined,

        customerAddress: quotation.customerAddress || undefined,

        customerGSTNumber: quotation.customerGSTNumber || undefined,

        items: quotation.items.map((item) => ({
          variantId: item.variantId,

          quantity: item.quantity,
        })),
      },

      userId,
    );

    await DocumentTimelineService.createEvent({
      documentId: quotation.id,

      userId,

      type: "CONVERTED",

      message: "Quotation converted to invoice",

      metadata: {
        convertedInvoiceId: invoice.id,
      },
    });

    return invoice;
  }

  static async updateDocument(
    documentId: string,

    data: {
      type: DocumentType;

      customerId?: string;

      customerName?: string;

      customerPhone?: string;

      customerEmail?: string;

      customerAddress?: string;

      customerGSTNumber?: string;

      items: {
        variantId: string;

        quantity: number;
      }[];

      payment?: {
        amount: number;

        method: string;
      };
    },

    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.document.findUnique({
        where: {
          id: documentId,
        },

        include: {
          items: true,
        },
      });

      if (!existing) {
        throw new Error("Document not found");
      }

      if (existing.status !== "DRAFT") {
        throw new Error("Only draft documents can be edited");
      }

      // DELETE OLD ITEMS
      await tx.documentItem.deleteMany({
        where: {
          documentId,
        },
      });

      let subtotal = 0;

      let gstTotal = 0;

      const processedItems = [];

      for (const item of data.items) {
        const variant = await tx.productVariant.findUnique({
          where: {
            id: item.variantId,
          },
        });

        if (!variant) {
          throw new Error("Variant not found");
        }

        const unitPrice = calculateSellingPrice(
          Number(variant.costPrice),

          Number(variant.profitMargin),
        );

        const lineAmount = unitPrice * item.quantity;

        const gstAmount = calculateGSTAmount(
          lineAmount,

          Number(variant.gstRate),
        );

        subtotal += lineAmount;

        gstTotal += gstAmount;

        processedItems.push({
          variant,

          quantity: item.quantity,

          unitPrice,

          gstRate: Number(variant.gstRate),

          lineTotal: lineAmount + gstAmount,
        });
      }

      const grandTotal = subtotal + gstTotal;

      const updatedDocument = await tx.document.update({
        where: {
          id: documentId,
        },

        data: {
          type: data.type,

          customerId: data.customerId,

          customerName: data.customerName,

          customerPhone: data.customerPhone,

          customerEmail: data.customerEmail,

          customerAddress: data.customerAddress,

          customerGSTNumber: data.customerGSTNumber,

          subtotal: new Prisma.Decimal(subtotal),

          gstTotal: new Prisma.Decimal(gstTotal),

          grandTotal: new Prisma.Decimal(grandTotal),
        },
      });

      for (const item of processedItems) {
        await tx.documentItem.create({
          data: {
            documentId: updatedDocument.id,

            variantId: item.variant.id,

            quantity: item.quantity,

            unitPrice: new Prisma.Decimal(item.unitPrice),

            gstRate: new Prisma.Decimal(item.gstRate),

            lineTotal: new Prisma.Decimal(item.lineTotal),
          },
        });
      }

      await DocumentTimelineService.createEvent({
        documentId: updatedDocument.id,

        userId,

        type: "UPDATED",

        message: "Draft document updated",
      });

      return updatedDocument;
    });
  }

  static async finalizeDraft(
    documentId: string,

    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id: documentId,
        },

        include: {
          items: true,
        },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      if (document.status !== "DRAFT") {
        throw new Error("Only drafts can be finalized");
      }

      // VALIDATE STOCK
      for (const item of document.items) {
        await InventoryService.validateStock(
          item.variantId,

          item.quantity,
        );
      }

      // CREATE STOCK MOVEMENTS
      for (const item of document.items) {
        await tx.stockMovement.create({
          data: {
            variantId: item.variantId,

            type: "SALE",

            quantity: item.quantity,

            referenceId: document.id,

            notes: "Draft finalized",
          },
        });

        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },

          data: {
            currentStock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const finalized = await tx.document.update({
        where: {
          id: document.id,
        },

        data: {
          status: "COMPLETED",

          type: "INVOICE",
        },
      });

      await DocumentTimelineService.createEvent({
        documentId: finalized.id,

        userId,

        type: "UPDATED",

        message: "Draft finalized into invoice",
      });

      return finalized;
    });
  }

  static async partialReturn(
    documentId: string,

    data: {
      items: {
        documentItemId: string;

        quantity: number;

        reason:
          | "DAMAGED"
          | "CUSTOMER_RETURN"
          | "BILLING_ERROR"
          | "EXPIRED"
          | "OTHER";

        notes?: string;
      }[];
    },

    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id: documentId,
        },

        include: {
          items: {
            include: {
              variant: true,
            },
          },
        },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      if (document.status === "CANCELLED") {
        throw new Error("Cannot return cancelled document");
      }

      let totalRefund = 0;

      // =========================
      // PROCESS RETURN ITEMS
      // =========================

      for (const returnItem of data.items) {
        const originalItem = document.items.find(
          (item) => item.id === returnItem.documentItemId,
        );

        if (!originalItem) {
          throw new Error("Document item not found");
        }

        // =========================
        // FAST RETURN CHECK
        // =========================

        const remainingQty =
          originalItem.quantity - originalItem.returnedQuantity;

        if (returnItem.quantity > remainingQty) {
          throw new Error(
            `Return quantity exceeds available quantity for ${originalItem.variant.displayName}`,
          );
        }

        // =========================
        // REFUND CALCULATION
        // =========================

        const unitRefund =
          Number(originalItem.lineTotal) / originalItem.quantity;

        const refundAmount = unitRefund * returnItem.quantity;

        totalRefund += refundAmount;

        // =========================
        // CREATE RETURN RECORD
        // =========================

        await tx.documentItemReturn.create({
          data: {
            documentId,

            documentItemId: originalItem.id,

            quantity: returnItem.quantity,

            refundAmount: new Prisma.Decimal(refundAmount),

            reason: returnItem.reason,

            notes: returnItem.notes,

            createdById: userId,
          },
        });

        // =========================
        // CACHE RETURNED QUANTITY
        // =========================

        await tx.documentItem.update({
          where: {
            id: originalItem.id,
          },

          data: {
            returnedQuantity: {
              increment: returnItem.quantity,
            },
          },
        });

        // =========================
        // RESTORE STOCK
        // =========================

        await tx.stockMovement.create({
          data: {
            variantId: originalItem.variantId,

            type: "RETURN",

            quantity: returnItem.quantity,

            referenceId: document.id,

            notes: "Partial Return",
          },
        });

        await tx.productVariant.update({
          where: {
            id: originalItem.variantId,
          },

          data: {
            currentStock: {
              increment: returnItem.quantity,
            },
          },
        });
      }

      // =========================
      // REFUND PAYMENT ENTRY
      // =========================

      await tx.payment.create({
        data: {
          documentId,

          amount: new Prisma.Decimal(totalRefund),

          method: "REFUND",

          status: "REFUND",

          isRefunded: true,

          refundAmount: new Prisma.Decimal(totalRefund),
        },
      });

      // =========================
      // RECALCULATE DOCUMENT STATUS
      // =========================

      const updatedItems = await tx.documentItem.findMany({
        where: {
          documentId,
        },
      });

      const allReturned = updatedItems.every(
        (item) => item.returnedQuantity >= item.quantity,
      );

      // =========================
      // UPDATE DOCUMENT STATUS
      // =========================

      await tx.document.update({
        where: {
          id: document.id,
        },

        data: {
          status: allReturned ? "RETURNED" : "PARTIALLY_RETURNED",
        },
      });

      // =========================
      // TIMELINE EVENT
      // =========================

      await DocumentTimelineService.createEvent({
        documentId,

        userId,

        type: "PARTIAL_RETURN",

        message: "Partial return processed",

        metadata: {
          refund: totalRefund,

          items: data.items.length,
        },
      });

      return {
        success: true,

        refundAmount: totalRefund,
      };
    });
  }

  static async rebillDocument(
    documentId: string,

    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const original = await tx.document.findUnique({
        where: {
          id: documentId,
        },

        include: {
          items: true,

          payments: true,
        },
      });

      if (!original) {
        throw new Error("Document not found");
      }

      // CREATE NEW DRAFT
      const rebill = await tx.document.create({
        data: {
          type: "DRAFT",

          status: "DRAFT",

          createdById: userId,

          rebillFromId: original.id,

          customerId: original.customerId,

          customerName: original.customerName,

          customerPhone: original.customerPhone,

          customerEmail: original.customerEmail,

          customerAddress: original.customerAddress,

          customerGSTNumber: original.customerGSTNumber,

          subtotal: original.subtotal,

          gstTotal: original.gstTotal,

          grandTotal: original.grandTotal,
        },
      });

      // COPY ITEMS
      for (const item of original.items) {
        await tx.documentItem.create({
          data: {
            documentId: rebill.id,

            variantId: item.variantId,

            quantity: item.quantity,

            unitPrice: item.unitPrice,

            gstRate: item.gstRate,

            lineTotal: item.lineTotal,
          },
        });
      }

      // TIMELINE EVENT
      await DocumentTimelineService.createEvent({
        documentId: original.id,

        userId,

        type: "REBILLED",

        message: "Rebill draft created",

        metadata: {
          rebillDocumentId: rebill.id,
        },
      });

      await DocumentTimelineService.createEvent({
        documentId: rebill.id,

        userId,

        type: "CREATED",

        message: "Draft created from rebill",

        metadata: {
          originalDocumentId: original.id,
        },
      });

      return rebill;
    });
  }

  // =========================
  // ADD PAYMENT
  // =========================

  static async addPayment(
    documentId: string,
    data: {
      amount: number;

      method: string;

      referenceNumber?: string;

      notes?: string;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: {
          id: documentId,
        },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      if (document.status === "CANCELLED") {
        throw new Error("Cannot add payment to cancelled document");
      }

      if (document.status === "RETURNED") {
        throw new Error("Cannot add payment to returned document");
      }

      const currentDue = Number(document.dueAmount);

      if (currentDue <= 0) {
        throw new Error("Document already fully paid");
      }

      if (data.amount > currentDue) {
        throw new Error("Payment exceeds remaining due");
      }

      // =========================
      // CREATE PAYMENT
      // =========================

      const payment = await tx.payment.create({
        data: {
          documentId,

          amount: new Prisma.Decimal(data.amount),

          method: data.method,

          referenceNumber: data.referenceNumber,

          notes: data.notes,
        },
      });

      // =========================
      // PAYMENT JOURNAL
      // =========================

      await JournalService.createEntry({
        documentId,

        type: "PAYMENT",

        description: `Payment received via ${data.method}`,

        totalAmount: data.amount,

        lines: [
          // CASH/BANK DEBIT
          {
            account: data.method === "CASH" ? "CASH" : "BANK",

            debit: data.amount,
          },

          // RECEIVABLE CREDIT
          {
            account: "RECEIVABLE",

            credit: data.amount,
          },
        ],
      });

      // =========================
      // NEW TOTALS
      // =========================

      const newPaidAmount = Number(document.paidAmount) + data.amount;

      const newDueAmount = Number(document.grandTotal) - newPaidAmount;

      const isPaid = newDueAmount <= 0;

      // =========================
      // UPDATE DOCUMENT
      // =========================

      const updatedDocument = await tx.document.update({
        where: {
          id: documentId,
        },

        data: {
          paidAmount: new Prisma.Decimal(newPaidAmount),

          dueAmount: new Prisma.Decimal(newDueAmount),

          isPaid,
        },
      });

      return {
        payment,

        document: updatedDocument,
      };
    });
  }

  // =========================
  // CUSTOMER LEDGER
  // =========================

  static async getCustomerLedger(customerId: string) {
    const documents = await prisma.document.findMany({
      where: {
        customerId,
      },

      include: {
        payments: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    let runningBalance = 0;

    const ledgerEntries = documents.map((document) => {
      const debit = Number(document.grandTotal);

      const credit = Number(document.paidAmount);

      runningBalance += debit - credit;

      return {
        id: document.id,

        type: document.type,

        status: document.status,

        createdAt: document.createdAt,

        debit,

        credit,

        balance: runningBalance,

        dueAmount: Number(document.dueAmount),

        isPaid: document.isPaid,
      };
    });

    const totalDebit = ledgerEntries.reduce(
      (sum, entry) => sum + entry.debit,
      0,
    );

    const totalCredit = ledgerEntries.reduce(
      (sum, entry) => sum + entry.credit,
      0,
    );

    const outstanding = runningBalance;

    return {
      entries: ledgerEntries,

      totalDebit,

      totalCredit,

      outstanding,
    };
  }

  // =========================
  // REFUND PAYMENT
  // =========================

  static async refundPayment(
    documentId: string,
    data: {
      paymentId: string;

      amount: number;

      reason: string;
    },
    userId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: {
          id: data.paymentId,
        },

        include: {
          document: true,
        },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      if (payment.documentId !== documentId) {
        throw new Error("Payment does not belong to this document");
      }

      const refundedAlready = Number(payment.refundAmount);

      const remainingRefundable = Number(payment.amount) - refundedAlready;

      if (data.amount > remainingRefundable) {
        throw new Error("Refund exceeds refundable amount");
      }

      // UPDATE PAYMENT
      const updatedPayment = await tx.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          refundAmount: {
            increment: data.amount,
          },

          refundReason: data.reason,

          isRefunded: refundedAlready + data.amount >= Number(payment.amount),
        },
      });

      // UPDATE DOCUMENT
      const updatedDocument = await tx.document.update({
        where: {
          id: documentId,
        },

        data: {
          paidAmount: {
            decrement: data.amount,
          },

          dueAmount: {
            increment: data.amount,
          },

          isPaid: false,
        },
      });

      // =========================
      // REFUND JOURNAL
      // =========================

      await JournalService.createEntry({
        documentId,

        type: "REFUND",

        description: `Refund issued - ${data.reason}`,

        totalAmount: data.amount,

        createdById: userId,

        lines: [
          // RECEIVABLE DEBIT
          {
            account: "RECEIVABLE",

            debit: data.amount,
          },

          // CASH/BANK CREDIT
          {
            account: payment.method === "CASH" ? "CASH" : "BANK",

            credit: data.amount,
          },
        ],
      });

      return {
        payment: updatedPayment,

        document: updatedDocument,
      };
    });
  }
}
