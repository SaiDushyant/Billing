import { z } from "zod";

export const createDocumentSchema = z.object({
  type: z.enum(["QUOTATION", "INVOICE", "BILL", "DRAFT"]),

  billingUserId: z.string().optional(),

  customerId: z.string().optional(),

  customerName: z.string().optional(),

  customerPhone: z.string().optional(),

  customerEmail: z.string().email().optional().or(z.literal("")),

  customerAddress: z.string().optional(),

  customerGSTNumber: z.string().optional(),

  items: z.array(
    z.object({
      variantId: z.string(),

      quantity: z.number().positive(),
    }),
  ),

  payments: z
    .array(
      z.object({
        amount: z.number(),

        method: z.string(),

        referenceNumber: z.string().optional(),

        notes: z.string().optional(),
      }),
    )
    .optional(),
});

export const partialReturnSchema = z.object({
  items: z.array(
    z.object({
      documentItemId: z.string(),

      quantity: z.number().positive(),

      reason: z.enum([
        "DAMAGED",
        "CUSTOMER_RETURN",
        "BILLING_ERROR",
        "EXPIRED",
        "OTHER",
      ]),

      notes: z.string().optional(),
    }),
  ),
});

export const addPaymentSchema = z.object({
  amount: z.number().positive(),

  method: z.string(),

  referenceNumber: z.string().optional(),

  notes: z.string().optional(),
});

export const refundPaymentSchema = z.object({
  paymentId: z.string(),

  amount: z.number().positive(),

  reason: z.string().min(3),
});
