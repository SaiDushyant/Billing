import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
});

export const createBrandSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().min(2),
  brandId: z.string(),
  description: z.string().optional(),
});

export const createVariantSchema = z.object({
  productId: z.string(),

  displayName: z.string(),

  attributes: z.record(z.string(), z.string()),

  costPrice: z.number(),
  sellingPrice: z.number(),

  gstRate: z.number(),

  sku: z.string(),

  barcode: z.string(),
});

export const updateVariantSchema = createVariantSchema.partial();
