import { Request, Response } from "express";

import { CustomersService } from "./customers.service";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customers.validation";

export class CustomersController {
  static async searchCustomers(
    req: Request,

    res: Response,
  ) {
    try {
      const search = String(req.query.search || "");

      const customers = await CustomersService.searchCustomers(search);

      res.json(customers);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to search customers";

      res.status(400).json({
        message,
      });
    }
  }

  static async createCustomer(
    req: Request,

    res: Response,
  ) {
    try {
      const validated = createCustomerSchema.parse(req.body);

      const customer = await CustomersService.createCustomer(validated);

      res.status(201).json(customer);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create customer";

      res.status(400).json({
        message,
      });
    }
  }

  static async updateCustomer(
    req: Request,

    res: Response,
  ) {
    try {
      const id = String(req.params.id);

      const validated = updateCustomerSchema.parse(req.body);

      const customer = await CustomersService.updateCustomer(id, validated);

      res.json(customer);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update customer";

      res.status(400).json({
        message,
      });
    }
  }
}
