"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const products_service_1 = require("./products.service");
const products_validation_1 = require("./products.validation");
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
}
exports.ProductsController = ProductsController;
