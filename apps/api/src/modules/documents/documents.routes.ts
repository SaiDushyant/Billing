import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { requireRole } from "../../middlewares/rbac.middleware";

import { DocumentsController } from "./documents.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", DocumentsController.createDocument);

router.get("/", DocumentsController.getAllDocuments);

router.get("/:id", DocumentsController.getDocument);

router.post("/:id/convert-to-invoice", DocumentsController.convertQuotation);

// CANCEL DOCUMENT
router.post(
  "/:id/cancel",

  requireRole(["ADMIN", "ACCOUNTANT"]),

  DocumentsController.cancelDocument,
);

// RETURN DOCUMENT
router.post(
  "/:id/return",

  requireRole(["ADMIN", "ACCOUNTANT"]),

  DocumentsController.returnDocument,
);

export default router;
