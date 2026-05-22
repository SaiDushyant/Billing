import type {
  InvoiceDocumentType,
  InvoiceItem,
  InvoiceTotals,
} from "@/types/invoice";

import type { BillingUser } from "@/types/user";

import { formatCurrency } from "@/utils/invoice";

interface Props {
  open: boolean;

  documentType: InvoiceDocumentType;

  customer: {
    name?: string;

    phone?: string;

    email?: string;

    address?: string;

    gstNumber?: string;
  };

  items: InvoiceItem[];

  totals: InvoiceTotals;

  billingUser: BillingUser | null;

  isSaving: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

export default function InvoicePreviewDialog({
  open,

  documentType,

  customer,

  items,

  totals,

  billingUser,

  isSaving,

  onClose,

  onConfirm,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-wide">
                Invoice Preview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Verify all details before saving
              </p>
            </div>

            <div className="rounded-xl border px-4 py-2 text-sm font-medium">
              {documentType}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-6">
          {/* STORE */}
          <div className="mb-8 flex items-start justify-between border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold">YOUR STORE NAME</h1>

              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>Lorem Ipsum Street</p>

                <p>Coimbatore, Tamil Nadu</p>

                <p>+91 9876543210</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Billing Operator
              </div>

              <div className="font-semibold">{billingUser?.name || "N/A"}</div>

              <div className="text-sm text-muted-foreground">
                {billingUser?.role}
              </div>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="mb-8 rounded-2xl border p-5">
            <h3 className="mb-4 text-lg font-semibold">Customer Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                {customer.name || "-"}
              </div>

              <div>
                <span className="text-muted-foreground">Phone:</span>{" "}
                {customer.phone || "-"}
              </div>

              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                {customer.email || "-"}
              </div>

              <div>
                <span className="text-muted-foreground">GST:</span>{" "}
                {customer.gstNumber || "-"}
              </div>

              <div className="col-span-2">
                <span className="text-muted-foreground">Address:</span>{" "}
                {customer.address || "-"}
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Product</th>

                  <th className="p-4 text-left">Qty</th>

                  <th className="p-4 text-left">Price</th>

                  <th className="p-4 text-left">GST</th>

                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">
                      <div className="font-medium">{item.displayName}</div>

                      <div className="text-xs text-muted-foreground">
                        {item.sku}
                      </div>
                    </td>

                    <td className="p-4">{item.quantity}</td>

                    <td className="p-4">{formatCurrency(item.unitPrice)}</td>

                    <td className="p-4">{item.gstRate}%</td>

                    <td className="p-4 text-right font-semibold">
                      {formatCurrency(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="mt-8 ml-auto w-full max-w-sm rounded-2xl border p-5">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>{formatCurrency(totals.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST</span>

                <span>{formatCurrency(totals.gstTotal)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>

                  <span>{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-3 font-medium transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onConfirm}
            className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : `Proceed & Save ${documentType}`}
          </button>
        </div>
      </div>
    </div>
  );
}
