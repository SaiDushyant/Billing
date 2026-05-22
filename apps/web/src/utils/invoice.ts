import type { InvoiceItem, InvoiceTotals } from "@/types/invoice";

export function calculateLineTotal(item: InvoiceItem) {
  const subtotal = item.unitPrice * item.quantity;

  const gstAmount = (subtotal * item.gstRate) / 100;

  const discount = item.discount || 0;

  return subtotal + gstAmount - discount;
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],

  shippingCharges = 0,
): InvoiceTotals {
  let subtotal = 0;

  let gstTotal = 0;

  let discountTotal = 0;

  for (const item of items) {
    const itemSubtotal = item.unitPrice * item.quantity;

    const itemGST = (itemSubtotal * item.gstRate) / 100;

    subtotal += itemSubtotal;

    gstTotal += itemGST;

    discountTotal += item.discount || 0;
  }

  const grandTotal = subtotal + gstTotal + shippingCharges - discountTotal;

  return {
    subtotal,

    gstTotal,

    discountTotal,

    shippingCharges,

    grandTotal,
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",

    currency: "INR",

    maximumFractionDigits: 2,
  }).format(amount);
}

export function createEmptyInvoiceRow(): InvoiceItem {
  return {
    id: crypto.randomUUID(),

    variantId: "",

    displayName: "",

    quantity: 1,

    unitPrice: 0,

    gstRate: 18,

    discount: 0,

    lineTotal: 0,

    search: "",

    showDropdown: false,
  };
}
