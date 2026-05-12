import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { InventoryController } from "./inventory.controller";

const router = Router();

router.use(authMiddleware);

router.post("/movements", InventoryController.createMovement);

router.post("/purchase-entry", InventoryController.createPurchaseEntry);

router.get("/stock/:variantId", InventoryController.getCurrentStock);

router.get("/overview", InventoryController.getOverview);

export default router;
