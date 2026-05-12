import { z } from "zod";

export const createDocumentSchema = z.object({
  type: z.enum(["QUOTATION", "INVOICE", "BILL", "DRAFT"]),

  customerId: z.string().optional(),

  items: z.array(
    z.object({
      variantId: z.string(),

      quantity: z.number().positive(),
    }),
  ),

  payment: z
    .object({
      amount: z.number(),

      method: z.string(),
    })
    .optional(),
});
