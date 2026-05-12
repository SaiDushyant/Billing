"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseEntrySchema = exports.createStockMovementSchema = void 0;
const zod_1 = require("zod");
exports.createStockMovementSchema = zod_1.z.object({
    variantId: zod_1.z.string(),
    type: zod_1.z.enum(["PURCHASE", "SALE", "RETURN", "ADJUSTMENT", "DAMAGED"]),
    quantity: zod_1.z.number().positive(),
    notes: zod_1.z.string().optional(),
    referenceId: zod_1.z.string().optional(),
});
exports.purchaseEntrySchema = zod_1.z.object({
    supplierId: zod_1.z.string(),
    invoiceNumber: zod_1.z.string(),
    items: zod_1.z.array(zod_1.z.object({
        variantId: zod_1.z.string(),
        quantity: zod_1.z.number().positive(),
        unitCost: zod_1.z.number().positive(),
    })),
});
