import { Plus, Trash2 } from "lucide-react";

import type { PaymentInput, PaymentMethod } from "@/types/payment";

import { formatCurrency } from "@/utils/invoice";

interface Props {
  grandTotal: number;

  payments: PaymentInput[];

  onChange: (payments: PaymentInput[]) => void;
}

const METHODS: PaymentMethod[] = ["CASH", "UPI", "CARD", "BANK", "CREDIT"];

export default function SplitPaymentPanel({
  grandTotal,
  payments,
  onChange,
}: Props) {
  // =========================
  // CALCULATIONS
  // =========================

  const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const dueAmount = grandTotal - paidAmount;

  // =========================
  // UPDATE PAYMENT
  // =========================

  function updatePayment(id: string, updates: Partial<PaymentInput>) {
    onChange(
      payments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              ...updates,
            }
          : payment,
      ),
    );
  }

  // =========================
  // REMOVE PAYMENT
  // =========================

  function removePayment(id: string) {
    onChange(payments.filter((payment) => payment.id !== id));
  }

  // =========================
  // ADD PAYMENT
  // =========================

  function addPayment() {
    onChange([
      ...payments,

      {
        id: crypto.randomUUID(),

        method: "CASH",

        amount: 0,
      },
    ]);
  }

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Payments</h2>

          <p className="text-sm text-slate-500">Split invoice payments</p>
        </div>

        <button
          type="button"
          onClick={addPayment}
          className="flex h-11 items-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Payment
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {/* TOTAL */}
        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Invoice Total</p>

          <p className="mt-2 text-2xl font-black">
            {formatCurrency(grandTotal)}
          </p>
        </div>

        {/* PAID */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Paid</p>

          <p className="mt-2 text-2xl font-black text-emerald-600">
            {formatCurrency(paidAmount)}
          </p>
        </div>

        {/* DUE */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm text-orange-700">Due</p>

          <p className="mt-2 text-2xl font-black text-orange-600">
            {formatCurrency(dueAmount)}
          </p>
        </div>
      </div>

      {/* PAYMENTS */}
      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
            No payment methods added
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5"
            >
              {/* TOP */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Payment Method
                  </h3>

                  <p className="text-xs text-slate-500">Split payment entry</p>
                </div>

                <button
                  type="button"
                  onClick={() => removePayment(payment.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* FIELDS */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* METHOD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Method
                  </label>

                  <select
                    value={payment.method}
                    onChange={(e) =>
                      updatePayment(payment.id, {
                        method: e.target.value as PaymentMethod,
                      })
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:ring-2 focus:ring-black"
                  >
                    {METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AMOUNT */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Amount
                  </label>

                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) =>
                      updatePayment(payment.id, {
                        amount: Number(e.target.value),
                      })
                    }
                    placeholder="Enter amount"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-lg font-semibold outline-none transition focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* REFERENCE */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Reference Number
                  </label>

                  <input
                    value={payment.referenceNumber || ""}
                    onChange={(e) =>
                      updatePayment(payment.id, {
                        referenceNumber: e.target.value,
                      })
                    }
                    placeholder="UPI Ref / Transaction ID / Cheque No"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* OVERPAY WARNING */}
      {dueAmount < 0 && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          Paid amount exceeds invoice total
        </div>
      )}
    </div>
  );
}
