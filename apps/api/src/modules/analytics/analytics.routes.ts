import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { requireRole } from "../../middlewares/rbac.middleware";

import { AnalyticsController } from "./analytics.controller";

const router = Router();

router.use(authMiddleware);

router.get(
  "/dashboard",
  requireRole(["ADMIN", "ACCOUNTANT"]),
  AnalyticsController.dashboard,
);

router.get(
  "/inventory",
  requireRole(["ADMIN", "ACCOUNTANT"]),
  AnalyticsController.inventory,
);

export default router;
