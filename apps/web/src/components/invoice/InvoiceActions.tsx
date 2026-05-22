import type { InvoiceDocumentType } from "@/types/invoice";

import type { BillingUser } from "@/types/user";

interface Props {
  documentType: InvoiceDocumentType;

  billingUser: BillingUser | null;

  users: BillingUser[];

  isSaving: boolean;

  onDocumentTypeChange: (type: InvoiceDocumentType) => void;

  onBillingUserChange: (user: BillingUser) => void;

  onSave: () => void;

  onReset: () => void;
}

export default function InvoiceActions({
  documentType,

  billingUser,

  users,

  isSaving,

  onDocumentTypeChange,

  onBillingUserChange,

  onSave,

  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold">Actions</h2>
      </div>

      {/* DOCUMENT TYPE */}
      <div className="mb-6 space-y-2">
        <label className="text-sm font-medium">Document Type</label>

        <select
          value={documentType}
          className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
          onChange={(e) =>
            onDocumentTypeChange(e.target.value as InvoiceDocumentType)
          }
        >
          <option value="INVOICE">Invoice</option>

          <option value="BILL">Bill</option>

          <option value="QUOTATION">Quotation</option>

          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* BILLING USER */}
      <div className="mb-6 space-y-2">
        <label className="text-sm font-medium">Billing Operator</label>

        <select
          value={billingUser?.id || ""}
          className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-black"
          onChange={(e) => {
            const selected = users.find((user) => user.id === e.target.value);

            if (selected) {
              onBillingUserChange(selected);
            }
          }}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-3">
        {/* SAVE */}
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="h-12 w-full rounded-xl bg-black font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : `Save ${documentType}`}
        </button>

        {/* RESET */}
        <button
          type="button"
          onClick={onReset}
          className="h-12 w-full rounded-xl border border-red-200 font-medium text-red-500 transition hover:bg-red-50"
        >
          Reset Invoice
        </button>
      </div>
    </div>
  );
}
