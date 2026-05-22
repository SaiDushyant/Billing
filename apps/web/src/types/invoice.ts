export type InvoiceDocumentType = "INVOICE" | "BILL" | "QUOTATION" | "DRAFT";

export interface InvoiceItem {
  id: string;

  variantId: string;

  displayName: string;

  sku?: string;

  barcode?: string;

  quantity: number;

  unitPrice: number;

  gstRate: number;

  discount?: number;

  lineTotal: number;

  // NEW
  mrp?: number;

  costPrice?: number;

  profitMargin?: number;

  search?: string;

  showDropdown?: boolean;
}

export interface CustomerDetails {
  name: string;

  phone: string;

  email: string;

  address: string;

  gstin: string;
}

export interface InvoiceTotals {
  subtotal: number;

  gstTotal: number;

  discountTotal: number;

  shippingCharges: number;

  grandTotal: number;
}

export interface ProductSearchResult {
  id: string;

  displayName: string;

  sku: string;

  barcode: string;

  mrp: number;

  gstRate: number;

  sellingPrice: number;

  // NEW
  costPrice: number;

  profitMargin: number;
}
