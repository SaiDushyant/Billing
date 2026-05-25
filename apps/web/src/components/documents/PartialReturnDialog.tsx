import { useMemo, useState } from "react";

import { RotateCcw, X } from "lucide-react";

import { formatCurrency } from "@/utils/invoice";

interface ReturnItem {
  documentItemId: string;

  quantity: number;

  reason: "DAMAGED" | "CUSTOMER_RETURN" | "BILLING_ERROR" | "EXPIRED" | "OTHER";

  notes?: string;
}

interface Props {
  open: boolean;

  onClose: () => void;

  document: any;

  onSubmit: (items: ReturnItem[]) => Promise<void>;
}

export default function PartialReturnDialog({
  open,
  onClose,
  document,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<ReturnItem[]>([]);

  if (!open || !document) {
    return null;
  }

  // =========================
  // UPDATE ITEM
  // =========================

  function updateItem(documentItemId: string, updates: Partial<ReturnItem>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.documentItemId === documentItemId);

      if (!existing) {
        return [
          ...prev,
          {
            documentItemId,

            quantity: 1,

            reason: "CUSTOMER_RETURN",

            ...updates,
          },
        ];
      }

      return prev.map((item) =>
        item.documentItemId === documentItemId
          ? {
              ...item,
              ...updates,
            }
          : item,
      );
    });
  }

  // =========================
  // GET RETURN ITEM
  // =========================

  function getReturnItem(documentItemId: string) {
    return items.find((i) => i.documentItemId === documentItemId);
  }

  // =========================
  // REFUND TOTAL
  // =========================

  const refundTotal = useMemo(() => {
    let total = 0;

    for (const item of items) {
      const original = document.items.find(
        (d: any) => d.id === item.documentItemId,
      );

      if (!original) {
        continue;
      }

      const perUnit = original.lineTotal / original.quantity;

      total += perUnit * item.quantity;
    }

    return total;
  }, [items, document.items]);

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit() {
    const filtered = items.filter((i) => i.quantity > 0);

    if (filtered.length === 0) {
      return;
    }

    try {
      setLoading(true);

      await onSubmit(filtered);

      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">Partial Return</h2>

            <p className="mt-1 text-sm text-slate-500">Process item returns</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {document.items.map((item: any) => {
              const remaining = item.quantity - item.returnedQuantity;

              const selected = getReturnItem(item.id);

              return (
                <div key={item.id} className="rounded-2xl border p-5">
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_120px_140px_200px]">
                    {/* PRODUCT */}
                    <div>
                      <h3 className="font-semibold">
                        {item.variant.displayName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        SKU: {item.variant.sku}
                      </p>

                      <div className="mt-3 flex gap-3 text-sm">
                        <span>
                          Sold: <strong>{item.quantity}</strong>
                        </span>

                        <span>
                          Returned:{" "}
                          <strong className="text-orange-600">
                            {item.returnedQuantity}
                          </strong>
                        </span>

                        <span>
                          Remaining:{" "}
                          <strong className="text-green-600">
                            {remaining}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* QUANTITY */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Return Qty
                      </label>

                      <input
                        type="number"
                        min={0}
                        max={remaining}
                        value={selected?.quantity || 0}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: Number(e.target.value),
                          })
                        }
                        className="h-11 w-full rounded-xl border px-3"
                      />
                    </div>

                    {/* REASON */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Reason
                      </label>

                      <select
                        value={selected?.reason || "CUSTOMER_RETURN"}
                        onChange={(e) =>
                          updateItem(item.id, {
                            reason: e.target.value as any,
                          })
                        }
                        className="h-11 w-full rounded-xl border px-3"
                      >
                        <option value="DAMAGED">Damaged</option>

                        <option value="CUSTOMER_RETURN">Customer Return</option>

                        <option value="BILLING_ERROR">Billing Error</option>

                        <option value="EXPIRED">Expired</option>

                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* REFUND */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Refund
                      </label>

                      <div className="flex h-11 items-center rounded-xl border bg-slate-50 px-4 font-semibold">
                        {formatCurrency(
                          ((item.lineTotal / item.quantity) *
                            (selected?.quantity || 0)) as number,
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t px-6 py-5">
          <div>
            <p className="text-sm text-slate-500">Total Refund</p>

            <p className="text-3xl font-black text-orange-600">
              {formatCurrency(refundTotal)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="h-12 rounded-xl border px-5 font-medium"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="flex h-12 items-center gap-2 rounded-xl bg-orange-600 px-5 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />

              {loading ? "Processing..." : "Process Return"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
