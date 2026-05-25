import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { requireRole } from "../../middlewares/rbac.middleware";

import { DocumentsController } from "./documents.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", DocumentsController.createDocument);

router.get("/", DocumentsController.getAllDocuments);

router.get("/:id", DocumentsController.getDocument);

router.patch("/:id", DocumentsController.updateDocument);

router.post("/:id/convert-to-invoice", DocumentsController.convertQuotation);

router.post("/:id/finalize", DocumentsController.finalizeDraft);

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

router.post(
  "/:id/partial-return",

  requireRole(["ADMIN", "ACCOUNTANT"]),

  DocumentsController.partialReturn,
);

router.post("/:id/rebill", DocumentsController.rebillDocument);

router.post(
  "/:id/payments",

  requireRole(["ADMIN", "ACCOUNTANT", "CASHIER"]),

  DocumentsController.addPayment,
);

router.get(
  "/customer/:customerId/ledger",

  requireRole(["ADMIN", "ACCOUNTANT", "CASHIER"]),

  DocumentsController.getCustomerLedger,
);

router.post(
  "/:id/refund",

  requireRole(["ADMIN", "ACCOUNTANT"]),

  DocumentsController.refundPayment,
);

export default router;
