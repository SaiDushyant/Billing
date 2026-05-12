import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { AnalyticsController } from "./analytics.controller";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", AnalyticsController.dashboard);

router.get("/inventory", AnalyticsController.inventory);

export default router;
