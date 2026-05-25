import { useEffect, useState } from "react";

interface Props {
  open: boolean;

  dueAmount: number;

  onClose: () => void;

  onSubmit: (data: {
    amount: number;

    method: string;

    referenceNumber?: string;
  }) => Promise<void>;
}

export default function AddPaymentDialog({
  open,
  dueAmount,
  onClose,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState(dueAmount);

  const [method, setMethod] = useState("CASH");

  const [referenceNumber, setReferenceNumber] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAmount(dueAmount);
  }, [dueAmount]);

  if (!open) {
    return null;
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      await onSubmit({
        amount,

        method,

        referenceNumber,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold">Add Payment</h2>

        <p className="mt-1 text-sm text-slate-500">
          Remaining Due: ₹{dueAmount.toFixed(2)}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Amount</label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-12 w-full rounded-xl border px-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Method</label>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-12 w-full rounded-xl border px-4"
            >
              <option value="CASH">CASH</option>

              <option value="UPI">UPI</option>

              <option value="CARD">CARD</option>

              <option value="BANK_TRANSFER">BANK TRANSFER</option>
            </select>
          </div>

          {method !== "CASH" && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Reference Number
              </label>

              <input
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="h-12 w-full rounded-xl border px-4"
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="h-11 rounded-xl border px-5">
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="h-11 rounded-xl bg-emerald-600 px-5 font-medium text-white"
          >
            {loading ? "Adding..." : "Add Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
