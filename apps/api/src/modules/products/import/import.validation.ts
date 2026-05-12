import { z } from "zod";

export const importRowSchema = z.object({
  productName: z.string(),

  brandName: z.string(),

  categoryName: z.string(),

  displayName: z.string(),

  sku: z.string(),

  barcode: z.string(),

  costPrice: z.coerce.number(),

  sellingPrice: z.coerce.number(),

  gstRate: z.coerce.number(),

  quantity: z.coerce.number(),
});
