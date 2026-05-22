import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { CustomersController } from "./customers.controller";

const router = Router();

router.use(authMiddleware);

router.get("/search", CustomersController.searchCustomers);

router.post("/", CustomersController.createCustomer);

router.patch("/:id", CustomersController.updateCustomer);

export default router;
