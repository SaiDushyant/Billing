import { Calendar, Copy, Eye, RotateCcw, X } from "lucide-react";

import { useState } from "react";

import { useAddPayment } from "@/features/documents/useAddPayment";

import { useDocumentActions } from "@/features/documents/useDocumentActions";

import type { DocumentItem } from "@/types/document";

import AddPaymentDialog from "./AddPaymentDialog";

import {
  getDocumentColor,
  getDocumentIcon,
  getStatusColor,
} from "@/utils/document";

interface Props {
  document: DocumentItem;

  onView: (document: DocumentItem) => void;
}

export default function DocumentCard({ document, onView }: Props) {
  const Icon = getDocumentIcon(document.type);

  const colors = getDocumentColor(document.type);

  const {
    cancelDocument,
    returnDocument,
    convertQuotation,
    isCancelling,
    isReturning,
    isConverting,
    rebillDocument,

    isRebilling,
  } = useDocumentActions();

  const [paymentOpen, setPaymentOpen] = useState(false);

  const addPaymentMutation = useAddPayment();

  // =========================
  // HANDLERS
  // =========================

  function handleCancel() {
    const confirmed = confirm("Cancel this document?");

    if (!confirmed) {
      return;
    }

    cancelDocument(document.id);
  }

  function handleReturn() {
    const reason = prompt("Return reason");

    if (!reason) {
      return;
    }

    returnDocument({
      documentId: document.id,

      reason,
    });
  }

  function handleConvert() {
    const confirmed = confirm("Convert quotation to invoice?");

    if (!confirmed) {
      return;
    }

    convertQuotation(document.id);
  }

  function handleRebill() {
    const confirmed = confirm("Create rebill draft?");

    if (!confirmed) {
      return;
    }

    rebillDocument(document.id);
  }

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT */}
        <div className="flex items-start gap-5">
          {/* ICON */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors.bg}`}
          >
            <Icon className={`h-8 w-8 ${colors.text}`} />
          </div>

          {/* INFO */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{document.type}</h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                  document.status,
                )}`}
              >
                {document.status}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    document.isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : document.paidAmount > 0
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {document.isPaid
                    ? "PAID"
                    : document.paidAmount > 0
                      ? "PARTIAL"
                      : "UNPAID"}
                </span>
              </span>
            </div>

            <p className="text-slate-500">Customer: {document.customerName}</p>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />

              {new Date(document.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="grid grid-cols-2 gap-8 xl:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500">Document No.</p>

            <p className="mt-1 font-bold">{document.id.slice(0, 8)}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Created By</p>

            <p className="mt-1 font-bold">
              {document.createdBy?.name || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Items</p>

            <p className="mt-1 font-bold">{document.itemCount} Items</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Total Amount</p>

            <p className="mt-1 text-2xl font-black">
              ₹{document.grandTotal.toFixed(2)}
            </p>
            {document.dueAmount > 0 && (
              <p className="mt-1 text-sm font-medium text-red-500">
                Due: ₹{document.dueAmount.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* VIEW */}
          <button
            onClick={() => onView(document)}
            className="flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          {/* CANCEL */}
          {document.status !== "CANCELLED" && (
            <button
              disabled={isCancelling}
              onClick={handleCancel}
              className="flex h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}

          {/* RETURN */}
          {document.type !== "DRAFT" && (
            <button
              disabled={isReturning}
              onClick={handleReturn}
              className="flex h-11 items-center gap-2 rounded-xl border border-orange-200 px-4 text-sm font-medium text-orange-500 transition hover:bg-orange-50 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Return
            </button>
          )}

          {/* CONVERT */}
          {document.type === "QUOTATION" && (
            <button
              disabled={isConverting}
              onClick={handleConvert}
              className="flex h-11 items-center gap-2 rounded-xl border border-blue-200 px-4 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
            >
              Convert
            </button>
          )}

          {/* REBILL */}
          <button
            disabled={isRebilling}
            onClick={handleRebill}
            className="flex h-11 items-center gap-2 rounded-xl border border-violet-200 px-4 text-sm font-medium text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Rebill
          </button>

          {/* EDIT DRAFT */}
          {document.type === "DRAFT" && (
            <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium transition hover:bg-slate-50">
              Edit
            </button>
          )}

          {/* DUE PAYMENT */}
          {document.dueAmount > 0 && (
            <button
              onClick={() => setPaymentOpen(true)}
              className="flex h-11 items-center gap-2 rounded-xl border border-emerald-200 px-4 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>

      <AddPaymentDialog
        open={paymentOpen}
        dueAmount={document.dueAmount}
        onClose={() => setPaymentOpen(false)}
        onSubmit={async (data) => {
          await addPaymentMutation.mutateAsync({
            documentId: document.id,

            amount: data.amount,

            method: data.method,

            referenceNumber: data.referenceNumber,
          });
        }}
      />
    </div>
  );
}
