"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRowSchema = void 0;
const zod_1 = require("zod");
exports.importRowSchema = zod_1.z.object({
    productName: zod_1.z.string(),
    brandName: zod_1.z.string(),
    categoryName: zod_1.z.string(),
    displayName: zod_1.z.string(),
    sku: zod_1.z.string(),
    barcode: zod_1.z.string(),
    costPrice: zod_1.z.coerce.number(),
    mrp: zod_1.z.coerce.number(),
    profitMargin: zod_1.z.coerce.number(),
    gstRate: zod_1.z.coerce.number(),
    quantity: zod_1.z.coerce.number(),
});
