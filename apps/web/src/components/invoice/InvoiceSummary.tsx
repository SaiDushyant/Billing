import type { InvoiceTotals } from "@/types/invoice";

import { formatCurrency } from "@/utils/invoice";

interface Props {
  totals: InvoiceTotals;

  shippingCharges: number;

  discountTotal: number;

  onShippingChange: (value: number) => void;

  onDiscountChange: (value: number) => void;
}

export default function InvoiceSummary({
  totals,

  shippingCharges,

  discountTotal,

  onShippingChange,

  onDiscountChange,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Invoice Summary</h2>
      </div>

      {/* SUMMARY ROWS */}
      <div className="space-y-4">
        {/* SUBTOTAL */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>

          <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
        </div>

        {/* GST */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">GST</span>

          <span className="font-medium">{formatCurrency(totals.gstTotal)}</span>
        </div>

        {/* SHIPPING */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Shipping Charges
          </label>

          <input
            type="number"
            min={0}
            value={shippingCharges}
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => onShippingChange(Number(e.target.value))}
          />
        </div>

        {/* DISCOUNT */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Discount</label>

          <input
            type="number"
            min={0}
            value={discountTotal}
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => onDiscountChange(Number(e.target.value))}
          />
        </div>

        {/* DIVIDER */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Grand Total</span>

            <span className="text-2xl font-bold">
              {formatCurrency(totals.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
