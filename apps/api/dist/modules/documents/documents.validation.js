"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentSchema = void 0;
const zod_1 = require("zod");
exports.createDocumentSchema = zod_1.z.object({
    type: zod_1.z.enum(["QUOTATION", "INVOICE", "BILL", "DRAFT"]),
    customerId: zod_1.z.string().optional(),
    items: zod_1.z.array(zod_1.z.object({
        variantId: zod_1.z.string(),
        quantity: zod_1.z.number().positive(),
    })),
    payment: zod_1.z
        .object({
        amount: zod_1.z.number(),
        method: zod_1.z.string(),
    })
        .optional(),
});
