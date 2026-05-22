import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2),

  phone: z.string().optional(),

  email: z.string().email().optional().or(z.literal("")),

  address: z.string().optional(),

  gstNumber: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
