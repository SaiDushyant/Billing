"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVariantSchema = exports.createProductSchema = exports.createBrandSchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
});
exports.createBrandSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    categoryId: zod_1.z.string(),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    brandId: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
exports.createVariantSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    displayName: zod_1.z.string(),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    costPrice: zod_1.z.number(),
    sellingPrice: zod_1.z.number(),
    gstRate: zod_1.z.number(),
    sku: zod_1.z.string(),
    barcode: zod_1.z.string(),
});
