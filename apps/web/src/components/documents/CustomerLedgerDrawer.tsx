import { X } from "lucide-react";

import { useCustomerLedger } from "@/features/documents/useCustomerLedger";

interface Props {
  open: boolean;

  customerId?: string;

  customerName?: string;

  onClose: () => void;
}

export default function CustomerLedgerDrawer({
  open,
  customerId,
  customerName,
  onClose,
}: Props) {
  const { data, isLoading } = useCustomerLedger(customerId);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-99999 flex">
      {/* OVERLAY */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* DRAWER */}
      <div className="relative ml-auto flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">Customer Ledger</h2>

            <p className="text-sm text-slate-500">{customerName}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div>Loading ledger...</div>
          ) : (
            <>
              {/* SUMMARY */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-500">Total Debit</p>

                  <p className="mt-2 text-2xl font-bold">
                    ₹{data?.totalDebit.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-500">Total Credit</p>

                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    ₹{data?.totalCredit.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="text-sm text-red-500">Outstanding</p>

                  <p className="mt-2 text-2xl font-black text-red-600">
                    ₹{data?.outstanding.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-hidden rounded-2xl border">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4 text-left">Date</th>

                      <th className="p-4 text-left">Document</th>

                      <th className="p-4 text-left">Debit</th>

                      <th className="p-4 text-left">Credit</th>

                      <th className="p-4 text-left">Due</th>

                      <th className="p-4 text-left">Balance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.entries.map((entry) => (
                      <tr key={entry.id} className="border-t">
                        <td className="p-4 text-sm">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          <div>
                            <p className="font-medium">{entry.type}</p>

                            <p className="text-xs text-slate-500">
                              #{entry.id.slice(0, 8)}
                            </p>
                          </div>
                        </td>

                        <td className="p-4 font-medium">
                          ₹{entry.debit.toFixed(2)}
                        </td>

                        <td className="p-4 text-emerald-600">
                          ₹{entry.credit.toFixed(2)}
                        </td>

                        <td className="p-4 text-red-500">
                          ₹{entry.dueAmount.toFixed(2)}
                        </td>

                        <td className="p-4 font-bold">
                          ₹{entry.balance.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
