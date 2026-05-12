import { z } from "zod";

export const createStockMovementSchema = z.object({
  variantId: z.string(),

  type: z.enum(["PURCHASE", "SALE", "RETURN", "ADJUSTMENT", "DAMAGED"]),

  quantity: z.number().positive(),

  notes: z.string().optional(),

  referenceId: z.string().optional(),
});

export const purchaseEntrySchema = z.object({
  supplierId: z.string(),

  invoiceNumber: z.string(),

  items: z.array(
    z.object({
      variantId: z.string(),

      quantity: z.number().positive(),

      unitCost: z.number().positive(),
    }),
  ),
});
