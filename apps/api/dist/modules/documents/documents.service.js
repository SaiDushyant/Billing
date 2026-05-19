"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const inventory_service_1 = require("../inventory/inventory.service");
const documents_utils_1 = require("./documents.utils");
const pricing_1 = require("../../utils/pricing");
const audit_service_1 = require("../audit/audit.service");
class DocumentsService {
    static async createDocument(data, userId) {
        return prisma_1.prisma.$transaction(async (tx) => {
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
                if (data.type === "INVOICE" || data.type === "BILL") {
                    await inventory_service_1.InventoryService.validateStock(variant.id, item.quantity);
                }
                const unitPrice = (0, pricing_1.calculateSellingPrice)(Number(variant.costPrice), Number(variant.profitMargin));
                const lineAmount = unitPrice * item.quantity;
                const gstAmount = (0, documents_utils_1.calculateGSTAmount)(lineAmount, Number(variant.gstRate));
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
            const document = await tx.document.create({
                data: {
                    type: data.type,
                    status: "COMPLETED",
                    customerId: data.customerId,
                    subtotal: new client_1.Prisma.Decimal(subtotal),
                    gstTotal: new client_1.Prisma.Decimal(gstTotal),
                    grandTotal: new client_1.Prisma.Decimal(grandTotal),
                },
            });
            for (const item of processedItems) {
                await tx.documentItem.create({
                    data: {
                        documentId: document.id,
                        variantId: item.variant.id,
                        quantity: item.quantity,
                        unitPrice: new client_1.Prisma.Decimal(item.unitPrice),
                        gstRate: new client_1.Prisma.Decimal(item.gstRate),
                        lineTotal: new client_1.Prisma.Decimal(item.lineTotal),
                    },
                });
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
            if (data.payment) {
                await tx.payment.create({
                    data: {
                        documentId: document.id,
                        amount: new client_1.Prisma.Decimal(data.payment.amount),
                        method: data.payment.method,
                    },
                });
            }
            // AUDIT LOG
            await audit_service_1.AuditService.log({
                userId,
                action: "SALE",
                entityType: "DOCUMENT",
                entityId: document.id,
                newData: {
                    type: document.type,
                    total: document.grandTotal,
                },
            });
            return document;
        });
    }
    static async cancelDocument(documentId, userId) {
        return prisma_1.prisma.$transaction(async (tx) => {
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
            await audit_service_1.AuditService.log({
                userId,
                action: "CANCEL",
                entityType: "DOCUMENT",
                entityId: document.id,
                metadata: {
                    status: "CANCELLED",
                },
            });
            return updatedDocument;
        });
    }
    static async returnDocument(documentId, reason, userId) {
        return prisma_1.prisma.$transaction(async (tx) => {
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
            await audit_service_1.AuditService.log({
                userId,
                action: "UPDATE",
                entityType: "DOCUMENT_RETURN",
                entityId: document.id,
                metadata: {
                    status: "RETURNED",
                    reason,
                },
            });
            return updatedDocument;
        });
    }
    static async getDocumentById(id) {
        return prisma_1.prisma.document.findUnique({
            where: {
                id,
            },
            include: {
                customer: true,
                items: {
                    include: {
                        variant: true,
                    },
                },
                payments: true,
            },
        });
    }
    static async getAllDocuments() {
        return prisma_1.prisma.document.findMany({
            include: {
                customer: true,
                payments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async convertQuotationToInvoice(quotationId) {
        const quotation = await prisma_1.prisma.document.findUnique({
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
        return this.createDocument({
            type: "INVOICE",
            customerId: quotation.customerId || undefined,
            items: quotation.items.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
            })),
        });
    }
}
exports.DocumentsService = DocumentsService;
