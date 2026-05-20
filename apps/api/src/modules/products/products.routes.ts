import { Router } from "express";

import { ProductsController } from "./products.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { upload } from "../../middlewares/upload.middleware";

import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

router.use(authMiddleware);

router.post(
  "/categories",
  requireRole(["ADMIN", "INVENTORY_MANAGER"]),
  ProductsController.createCategory,
);

router.post(
  "/brands",
  requireRole(["ADMIN", "INVENTORY_MANAGER"]),
  ProductsController.createBrand,
);

router.post(
  "/products",
  requireRole(["ADMIN", "INVENTORY_MANAGER"]),
  ProductsController.createProduct,
);

router.post(
  "/variants",
  requireRole(["ADMIN", "INVENTORY_MANAGER"]),
  ProductsController.createVariant,
);

router.get("/variants/search", ProductsController.searchVariants);

router.patch(
  "/variants/:id",
  requireRole(["ADMIN", "INVENTORY_MANAGER"]),
  ProductsController.updateVariant,
);

router.get("/variants", ProductsController.getVariants);

router.post(
  "/variants/import",
  requireRole(["ADMIN", "INVENTORY_MANAGER"]),
  upload.single("file"),
  ProductsController.importVariants,
);

export default router;
