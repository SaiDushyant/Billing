"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
class InventoryService {
    static async createMovement(data) {
        return prisma_1.prisma.stockMovement.create({
            data,
        });
    }
    static async getCurrentStock(variantId) {
        const movements = await prisma_1.prisma.stockMovement.findMany({
            where: {
                variantId,
            },
        });
        let stock = 0;
        for (const movement of movements) {
            switch (movement.type) {
                case "PURCHASE":
                case "RETURN":
                    stock += movement.quantity;
                    break;
                case "SALE":
                case "DAMAGED":
                    stock -= movement.quantity;
                    break;
                case "ADJUSTMENT":
                    stock += movement.quantity;
                    break;
            }
        }
        return stock;
    }
    static async validateStock(variantId, quantity) {
        const currentStock = await this.getCurrentStock(variantId);
        if (currentStock < quantity) {
            throw new Error(`Insufficient stock. Available: ${currentStock}`);
        }
        return true;
    }
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
                await tx.stockMovement.create({
                    data: {
                        variantId: item.variantId,
                        type: "PURCHASE",
                        quantity: item.quantity,
                        referenceId: purchase.id,
                        notes: `Purchase Invoice ${data.invoiceNumber}`,
                    },
                });
            }
            return purchase;
        });
    }
    static async getInventoryOverview() {
        const variants = await prisma_1.prisma.productVariant.findMany({
            include: {
                product: {
                    include: {
                        brand: true,
                    },
                },
                stockMovements: true,
            },
        });
        return variants.map((variant) => {
            let stock = 0;
            for (const movement of variant.stockMovements) {
                switch (movement.type) {
                    case "PURCHASE":
                    case "RETURN":
                        stock += movement.quantity;
                        break;
                    case "SALE":
                    case "DAMAGED":
                        stock -= movement.quantity;
                        break;
                    case "ADJUSTMENT":
                        stock += movement.quantity;
                        break;
                }
            }
            return {
                id: variant.id,
                displayName: variant.displayName,
                sku: variant.sku,
                barcode: variant.barcode,
                sellingPrice: variant.sellingPrice,
                currentStock: stock,
                lowStock: stock < 5,
                product: variant.product,
            };
        });
    }
}
exports.InventoryService = InventoryService;
