"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rbac_middleware_1 = require("../../middlewares/rbac.middleware");
const documents_controller_1 = require("./documents.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post("/", documents_controller_1.DocumentsController.createDocument);
router.get("/", documents_controller_1.DocumentsController.getAllDocuments);
router.get("/:id", documents_controller_1.DocumentsController.getDocument);
router.post("/:id/convert-to-invoice", documents_controller_1.DocumentsController.convertQuotation);
// CANCEL DOCUMENT
router.post("/:id/cancel", (0, rbac_middleware_1.requireRole)(["ADMIN", "ACCOUNTANT"]), documents_controller_1.DocumentsController.cancelDocument);
// RETURN DOCUMENT
router.post("/:id/return", (0, rbac_middleware_1.requireRole)(["ADMIN", "ACCOUNTANT"]), documents_controller_1.DocumentsController.returnDocument);
exports.default = router;
