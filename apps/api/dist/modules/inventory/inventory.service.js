"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const pricing_1 = require("../../utils/pricing");
class InventoryService {
    // =========================
    // STOCK CALCULATION ENGINE
    // =========================
    static calculateStock(movements) {
        return movements.reduce((total, movement) => total + movement.quantity, 0);
    }
    // =========================
    // CREATE STOCK MOVEMENT
    // =========================
    static async createMovement(data) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const variant = await tx.productVariant.findUnique({
                where: {
                    id: data.variantId,
                },
                select: {
                    currentStock: true,
                },
            });
            if (!variant) {
                throw new Error("Variant not found");
            }
            const newStock = variant.currentStock + data.quantity;
            if (newStock < 0) {
                throw new Error(`Insufficient stock. Available: ${variant.currentStock}`);
            }
            const movement = await tx.stockMovement.create({
                data: {
                    variantId: data.variantId,
                    type: data.type,
                    // SIGNED QUANTITY
                    quantity: data.quantity,
                    notes: data.notes,
                    referenceId: data.referenceId,
                },
            });
            await tx.productVariant.update({
                where: {
                    id: data.variantId,
                },
                data: {
                    currentStock: {
                        increment: data.quantity,
                    },
                },
            });
            return {
                movement,
                currentStock: newStock,
            };
        });
    }
    // =========================
    // GET CURRENT STOCK
    // =========================
    static async getCurrentStock(variantId) {
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
            select: {
                currentStock: true,
            },
        });
        if (!variant) {
            throw new Error("Variant not found");
        }
        return variant.currentStock;
    }
    // =========================
    // VALIDATE STOCK
    // =========================
    static async validateStock(variantId, quantity) {
        const variant = await prisma_1.prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
            select: {
                currentStock: true,
            },
        });
        if (!variant) {
            throw new Error("Variant not found");
        }
        if (variant.currentStock < quantity) {
            throw new Error(`Insufficient stock. Available: ${variant.currentStock}`);
        }
        return true;
    }
    // =========================
    // PURCHASE ENTRY
    // =========================
    static async createPurchaseEntry(data) {
        return prisma_1.prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            for (const item of data.items) {
                totalAmount += item.quantity * item.unitCost;
            }
            const purchase = await tx.purchase.create({
                data: {
                    supplierId: data.supplierId,
                    invoiceNumber: data.invoiceNumber,
                    totalAmount: new client_1.Prisma.Decimal(totalAmount),
                },
            });
            for (const item of data.items) {
                await tx.purchaseItem.create({
                    data: {
                        purchaseId: purchase.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        unitCost: new client_1.Prisma.Decimal(item.unitCost),
                    },
                });
                // PURCHASE = POSITIVE
                await tx.stockMovement.create({
                    data: {
                        variantId: item.variantId,
                        type: "PURCHASE",
                        quantity: item.quantity,
                        referenceId: purchase.id,
                        notes: `Purchase Invoice ${data.invoiceNumber}`,
                    },
                });
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
            return purchase;
        });
    }
    // =========================
    // INVENTORY OVERVIEW
    // =========================
    static async getInventoryOverview() {
        const variants = await prisma_1.prisma.productVariant.findMany({
            include: {
                product: {
                    include: {
                        brand: true,
                    },
                },
            },
        });
        return variants.map((variant) => {
            const sellingPrice = (0, pricing_1.calculateSellingPrice)(Number(variant.costPrice), Number(variant.profitMargin));
            return {
                id: variant.id,
                displayName: variant.displayName,
                sku: variant.sku,
                barcode: variant.barcode,
                costPrice: variant.costPrice,
                mrp: variant.mrp,
                profitMargin: variant.profitMargin,
                sellingPrice,
                currentStock: variant.currentStock,
                lowStock: variant.currentStock < 5,
                product: variant.product,
            };
        });
    }
    // =========================
    // STOCK RECONCILIATION
    // =========================
    static async reconcileStock(variantId) {
        const movements = await prisma_1.prisma.stockMovement.findMany({
            where: {
                variantId,
            },
            select: {
                quantity: true,
            },
        });
        const actualStock = this.calculateStock(movements);
        await prisma_1.prisma.productVariant.update({
            where: {
                id: variantId,
            },
            data: {
                currentStock: actualStock,
            },
        });
        return {
            variantId,
            actualStock,
        };
    }
}
exports.InventoryService = InventoryService;
