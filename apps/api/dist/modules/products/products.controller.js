"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const fs_1 = __importDefault(require("fs"));
const products_service_1 = require("./products.service");
const products_validation_1 = require("./products.validation");
const import_utils_1 = require("./import/import.utils");
const import_validation_1 = require("./import/import.validation");
const audit_utils_1 = require("../../utils/audit.utils");
class ProductsController {
    static async createCategory(req, res) {
        try {
            const validated = products_validation_1.createCategorySchema.parse(req.body);
            const category = await products_service_1.ProductsService.createCategory(validated.name);
            res.status(201).json(category);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async createBrand(req, res) {
        try {
            const validated = products_validation_1.createBrandSchema.parse(req.body);
            const brand = await products_service_1.ProductsService.createBrand(validated.name, validated.categoryId);
            res.status(201).json(brand);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async createProduct(req, res) {
        try {
            const validated = products_validation_1.createProductSchema.parse(req.body);
            const product = await products_service_1.ProductsService.createProduct(validated.name, validated.brandId, validated.description);
            res.status(201).json(product);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async createVariant(req, res) {
        try {
            const validated = products_validation_1.createVariantSchema.parse(req.body);
            const variant = await products_service_1.ProductsService.createVariant(validated);
            res.status(201).json(variant);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async searchVariants(req, res) {
        try {
            const search = String(req.query.search || "");
            const variants = await products_service_1.ProductsService.searchVariants(search);
            res.json(variants);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async updateVariant(req, res) {
        try {
            const validatedData = products_validation_1.updateVariantSchema.parse(req.body);
            const id = String(req.params.id);
            const oldVariant = await products_service_1.ProductsService.getVariantById(id);
            const variant = await products_service_1.ProductsService.updateVariant(id, validatedData);
            await (0, audit_utils_1.createAuditLog)({
                req,
                action: "UPDATE",
                entityType: "PRODUCT_VARIANT",
                entityId: variant.id,
                oldData: oldVariant,
                newData: variant,
            });
            res.json(variant);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async getVariants(req, res) {
        try {
            const result = await products_service_1.ProductsService.getVariants({
                search: String(req.query.search || ""),
                page: Number(req.query.page || 1),
                limit: Number(req.query.limit || 20),
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async importVariants(req, res) {
        try {
            if (!req.file) {
                throw new Error("File required");
            }
            // FIXED HERE
            const rows = await (0, import_utils_1.parseImportFile)(req.file.path);
            const validatedRows = rows.map((row) => import_validation_1.importRowSchema.parse(row));
            const results = await products_service_1.ProductsService.importVariants(validatedRows);
            // AUDIT LOG
            await (0, audit_utils_1.createAuditLog)({
                req,
                action: "IMPORT",
                entityType: "PRODUCT_VARIANT",
                metadata: {
                    importedRows: results.filter((r) => r.success).length,
                    failedRows: results.filter((r) => !r.success).length,
                },
            });
            // DELETE TEMP FILE
            fs_1.default.unlinkSync(req.file.path);
            res.json(results);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}
exports.ProductsController = ProductsController;
