"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("./inventory.service");
const inventory_validation_1 = require("./inventory.validation");
class InventoryController {
    static async createMovement(req, res) {
        try {
            const validated = inventory_validation_1.createStockMovementSchema.parse(req.body);
            const movement = await inventory_service_1.InventoryService.createMovement(validated);
            res.status(201).json(movement);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async getCurrentStock(req, res) {
        try {
            const stock = await inventory_service_1.InventoryService.getCurrentStock(req.params.variantId);
            res.json({
                stock,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async createPurchaseEntry(req, res) {
        try {
            const validated = inventory_validation_1.purchaseEntrySchema.parse(req.body);
            const purchase = await inventory_service_1.InventoryService.createPurchaseEntry(validated);
            res.status(201).json(purchase);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async getOverview(_, res) {
        try {
            const inventory = await inventory_service_1.InventoryService.getInventoryOverview();
            res.json(inventory);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}
exports.InventoryController = InventoryController;
