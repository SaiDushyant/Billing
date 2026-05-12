import { Request, Response } from "express";

import { InventoryService } from "./inventory.service";

import {
  createStockMovementSchema,
  purchaseEntrySchema,
} from "./inventory.validation";

type Params = {
  variantId: string;
};

export class InventoryController {
  static async createMovement(req: Request, res: Response) {
    try {
      const validated = createStockMovementSchema.parse(req.body);

      const movement = await InventoryService.createMovement(validated);

      res.status(201).json(movement);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getCurrentStock(req: Request<Params>, res: Response) {
    try {
      const stock = await InventoryService.getCurrentStock(
        req.params.variantId,
      );

      res.json({
        stock,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async createPurchaseEntry(req: Request, res: Response) {
    try {
      const validated = purchaseEntrySchema.parse(req.body);

      const purchase = await InventoryService.createPurchaseEntry(validated);

      res.status(201).json(purchase);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getOverview(_: Request, res: Response) {
    try {
      const inventory = await InventoryService.getInventoryOverview();

      res.json(inventory);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
