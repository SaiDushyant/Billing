import { Router } from "express";

import { ProductsController } from "./products.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/categories", ProductsController.createCategory);

router.post("/brands", ProductsController.createBrand);

router.post("/products", ProductsController.createProduct);

router.post("/variants", ProductsController.createVariant);

router.get("/variants/search", ProductsController.searchVariants);

router.patch("/variants/:id", ProductsController.updateVariant);

router.get("/variants", ProductsController.getVariants);

router.post(
  "/variants/import",
  upload.single("file"),
  ProductsController.importVariants,
);

export default router;
