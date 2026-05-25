import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { requireRole } from "../../middlewares/rbac.middleware";

import { AuditController } from "./audit.controller";

const router = Router();

router.use(authMiddleware);

router.use(requireRole(["ADMIN"]));

router.get("/export", AuditController.exportLogs);

router.get("/", AuditController.getLogs);

export default router;
