import { Request, Response } from "express";

import fs from "fs";

import { ProductsService } from "./products.service";

import {
  createBrandSchema,
  createCategorySchema,
  createProductSchema,
  createVariantSchema,
  updateVariantSchema,
} from "./products.validation";

import { parseImportFile } from "./import/import.utils";

import { importRowSchema } from "./import/import.validation";

export class ProductsController {
  static async createCategory(req: Request, res: Response) {
    try {
      const validated = createCategorySchema.parse(req.body);

      const category = await ProductsService.createCategory(validated.name);

      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async createBrand(req: Request, res: Response) {
    try {
      const validated = createBrandSchema.parse(req.body);

      const brand = await ProductsService.createBrand(
        validated.name,
        validated.categoryId,
      );

      res.status(201).json(brand);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const validated = createProductSchema.parse(req.body);

      const product = await ProductsService.createProduct(
        validated.name,
        validated.brandId,
        validated.description,
      );

      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async createVariant(req: Request, res: Response) {
    try {
      const validated = createVariantSchema.parse(req.body);

      const variant = await ProductsService.createVariant(validated);

      res.status(201).json(variant);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async searchVariants(req: Request, res: Response) {
    try {
      const search = String(req.query.search || "");

      const variants = await ProductsService.searchVariants(search);

      res.json(variants);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async updateVariant(req: Request, res: Response) {
    try {
      const validated = updateVariantSchema.parse(req.body);
      const id = String(req.params.id);
      const variant = await ProductsService.updateVariant(id, validated);
      res.json(variant);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getVariants(req: Request, res: Response) {
    try {
      const result = await ProductsService.getVariants({
        search: String(req.query.search || ""),

        page: Number(req.query.page || 1),

        limit: Number(req.query.limit || 20),
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async importVariants(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "File required",
        });
      }

      const rows = await parseImportFile(req.file.path);

      const validatedRows = rows.map((row) => importRowSchema.parse(row));

      const results = await ProductsService.importVariants(validatedRows);

      fs.unlinkSync(req.file.path);

      res.json(results);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
