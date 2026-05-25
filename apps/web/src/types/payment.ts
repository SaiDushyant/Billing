export type PaymentMethod = "CASH" | "UPI" | "CARD" | "BANK" | "CREDIT";

export type PaymentInput = {
  id: string;

  method: PaymentMethod;

  amount: number;

  referenceNumber?: string;

  notes?: string;
};
