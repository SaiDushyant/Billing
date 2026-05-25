import { Copy, FilePenLine, Printer, RotateCcw, X } from "lucide-react";

import { useState } from "react";

import PartialReturnDialog from "./PartialReturnDialog";

import { useDocument } from "@/features/documents/useDocument";

import { useDocumentActions } from "@/features/documents/useDocumentActions";

import { formatCurrency } from "@/utils/invoice";

import { useRefundPayment } from "@/features/documents/useRefundPayment";

interface Props {
  open: boolean;

  onClose: () => void;

  documentId?: string;
}

function getReturnStatus(quantity: number, returnedQuantity: number) {
  if (returnedQuantity === 0) {
    return {
      label: "ACTIVE",

      className: "bg-green-100 text-green-700",
    };
  }

  if (returnedQuantity >= quantity) {
    return {
      label: "FULLY RETURNED",

      className: "bg-red-100 text-red-700",
    };
  }

  return {
    label: "PARTIALLY RETURNED",

    className: "bg-orange-100 text-orange-700",
  };
}

export default function DocumentPreviewDrawer({
  open,
  onClose,
  documentId,
}: Props) {
  const { data, isLoading } = useDocument(documentId);

  const {
    rebillDocument,

    isRebilling,
  } = useDocumentActions();

  const [partialReturnOpen, setPartialReturnOpen] = useState(false);

  const { partialReturn, isPartialReturning } = useDocumentActions();

  const refundMutation = useRefundPayment();

  function handleRebill() {
    if (!data) {
      return;
    }

    const confirmed = confirm("Create rebill draft?");

    if (!confirmed) {
      return;
    }

    rebillDocument(data.id);
  }

  if (!open) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          Loading document...
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-99999 flex">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">{data.type}</h2>

            <p className="text-sm text-slate-500">#{data.id.slice(0, 8)}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* CUSTOMER */}
          <div className="rounded-2xl border bg-slate-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">Customer Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Name</p>

                <p className="font-medium">
                  {data.customerName || "Walk-in Customer"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Phone</p>

                <p className="font-medium">{data.customerPhone || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Created By</p>

                <p className="font-medium">
                  {data.createdBy?.name || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Date</p>

                <p className="font-medium">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* TOTALS */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border p-5">
              <p className="text-sm text-slate-500">Subtotal</p>

              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(data.subtotal)}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-slate-500">GST</p>

              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(data.gstTotal)}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-600 p-5 text-white">
              <p className="text-sm text-blue-100">Grand Total</p>

              <p className="mt-2 text-3xl font-black">
                {formatCurrency(data.grandTotal)}
              </p>
            </div>
          </div>

          {/* REFUND SUMMARY */}
          {data.items.some((item) => item.returnedQuantity > 0) && (
            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">Total Refunded</p>

                  <p className="mt-1 text-3xl font-black text-orange-600">
                    {formatCurrency(
                      data.items.reduce((sum, item) => {
                        return (
                          sum +
                          (item.returns?.reduce(
                            (s, r) => s + r.refundAmount,
                            0,
                          ) || 0)
                        );
                      }, 0),
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm text-slate-500">Returned Items</p>

                  <p className="text-2xl font-bold">
                    {data.items.filter((i) => i.returnedQuantity > 0).length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATUS */}
          <div className="mt-6 rounded-2xl border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Status</p>

                <div className="mt-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      data.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : data.status === "PARTIALLY_RETURNED"
                          ? "bg-orange-100 text-orange-700"
                          : data.status === "RETURNED"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {data.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Items</p>

                <p className="mt-1 text-lg font-bold">{data.itemCount}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Payments</p>

                <p className="mt-1 text-lg font-bold">{data.paymentCount}</p>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="mt-6 overflow-hidden rounded-2xl border">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">
                    Product
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">SKU</th>

                  <th className="p-4 text-left text-sm font-semibold">Qty</th>

                  <th className="p-4 text-left text-sm font-semibold">Rate</th>

                  <th className="p-4 text-left text-sm font-semibold">GST</th>

                  <th className="p-4 text-left text-sm font-semibold">Total</th>
                </tr>
              </thead>

              <tbody>
                {data.items.map((item) => {
                  const remaining = item.quantity - item.returnedQuantity;

                  const returnStatus = getReturnStatus(
                    item.quantity,
                    item.returnedQuantity,
                  );

                  return (
                    <tr
                      key={item.id}
                      className={`border-t transition ${
                        item.returnedQuantity > 0 ? "bg-orange-50/40" : ""
                      }`}
                    >
                      {/* PRODUCT */}
                      <td className="p-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-medium">
                              {item.variant.displayName}
                            </p>

                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-bold ${returnStatus.className}`}
                            >
                              {returnStatus.label}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.variant.barcode}
                          </p>

                          {/* RETURN INFO */}
                          {item.returnedQuantity > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-lg bg-red-100 px-2 py-1 font-medium text-red-700">
                                Returned: {item.returnedQuantity}
                              </span>

                              <span className="rounded-lg bg-green-100 px-2 py-1 font-medium text-green-700">
                                Remaining: {remaining}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4 text-sm">{item.variant.sku}</td>

                      {/* QTY */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-medium">{item.quantity}</div>

                          {item.returnedQuantity > 0 && (
                            <div className="text-xs text-orange-600">
                              - {item.returnedQuantity} returned
                            </div>
                          )}
                        </div>
                      </td>

                      {/* RATE */}
                      <td className="p-4">{formatCurrency(item.unitPrice)}</td>

                      {/* GST */}
                      <td className="p-4">{item.gstRate}%</td>

                      {/* TOTAL */}
                      <td className="p-4 font-semibold">
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RETURN HISTORY */}
          {data.items.some(
            (item) => item.returns && item.returns.length > 0,
          ) && (
            <div className="mt-6 rounded-2xl border p-5">
              <h3 className="mb-5 text-lg font-semibold">Return History</h3>

              <div className="space-y-4">
                {data.items.flatMap(
                  (item) =>
                    item.returns?.map((returnItem) => (
                      <div
                        key={returnItem.id}
                        className="rounded-2xl border bg-orange-50 p-4"
                      >
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                          <div>
                            <p className="font-semibold">
                              {item.variant.displayName}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-lg bg-orange-100 px-2 py-1 font-medium text-orange-700">
                                Qty: {returnItem.quantity}
                              </span>

                              <span className="rounded-lg bg-red-100 px-2 py-1 font-medium text-red-700">
                                {returnItem.reason}
                              </span>
                            </div>

                            {returnItem.notes && (
                              <p className="mt-3 text-sm text-slate-600">
                                {returnItem.notes}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-slate-500">Refund</p>

                            <p className="text-lg font-bold text-orange-600">
                              {formatCurrency(returnItem.refundAmount)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(returnItem.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )) || [],
                )}
              </div>
            </div>
          )}

          {/* PAYMENT SUMMARY */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* PAID */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Paid Amount</p>

              <p className="mt-2 text-3xl font-black text-emerald-600">
                {formatCurrency(data.paidAmount)}
              </p>
            </div>

            {/* DUE */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <p className="text-sm text-orange-700">Due Amount</p>

              <p className="mt-2 text-3xl font-black text-orange-600">
                {formatCurrency(data.dueAmount)}
              </p>
            </div>

            {/* STATUS */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-sm text-blue-700">Payment Status</p>

              <p className="mt-2 text-2xl font-black text-blue-700">
                {data.dueAmount > 0 ? "PARTIAL" : "PAID"}
              </p>
            </div>
          </div>

          {/* PAYMENT TIMELINE */}
          <div className="mt-6 rounded-2xl border p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Payment Timeline</h3>

                <p className="text-sm text-slate-500">
                  Complete transaction history
                </p>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  data.isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {data.isPaid
                  ? "Fully Paid"
                  : `Due ₹${data.dueAmount.toFixed(2)}`}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="space-y-4">
              {data.payments.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">
                  No payments recorded
                </div>
              ) : (
                data.payments.map((payment, index) => (
                  <div key={payment.id} className="relative flex gap-4">
                    {/* LINE */}
                    {index !== data.payments.length - 1 && (
                      <div className="absolute left-5 top-12 h-full w-px bg-slate-200" />
                    )}

                    {/* DOT */}
                    <div className="relative z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                      ₹
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 rounded-2xl border bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        {/* LEFT */}
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{payment.method}</h4>

                            {payment.isRefunded && (
                              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                                Refunded
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {new Date(payment.createdAt).toLocaleString()}
                          </p>

                          {payment.referenceNumber && (
                            <p className="mt-2 text-xs text-slate-500">
                              Ref: {payment.referenceNumber}
                            </p>
                          )}

                          {payment.notes && (
                            <p className="mt-2 text-sm">{payment.notes}</p>
                          )}
                          {!payment.isRefunded && (
                            <button
                              onClick={async () => {
                                const reason = prompt("Refund reason");

                                if (!reason) {
                                  return;
                                }

                                await refundMutation.mutateAsync({
                                  documentId: data.id,

                                  paymentId: payment.id,

                                  amount: payment.amount,

                                  reason,
                                });
                              }}
                              className="mt-3 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Refund Payment
                            </button>
                          )}
                        </div>

                        {/* RIGHT */}
                        <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600">
                            ₹{payment.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SUMMARY */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-slate-500">Invoice Total</p>

                <p className="mt-2 text-xl font-bold">
                  ₹{data.grandTotal.toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-600">Paid Amount</p>

                <p className="mt-2 text-xl font-bold text-emerald-700">
                  ₹{data.paidAmount.toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-500">Outstanding</p>

                <p className="mt-2 text-xl font-black text-red-600">
                  ₹{data.dueAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t px-6 py-4">
          <div className="flex items-center gap-3">
            <button className="flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-slate-50">
              <Printer className="h-4 w-4" />
              Print
            </button>

            <button className="flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-slate-50">
              <FilePenLine className="h-4 w-4" />
              Edit
            </button>

            <button
              disabled={isRebilling}
              onClick={handleRebill}
              className="flex h-11 items-center gap-2 rounded-xl border border-violet-200 px-4 text-sm font-medium text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              Rebill
            </button>

            {data.status !== "CANCELLED" && (
              <button
                disabled={isPartialReturning}
                onClick={() => setPartialReturnOpen(true)}
                className="flex h-11 items-center gap-2 rounded-xl border border-orange-200 px-4 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />

                {isPartialReturning ? "Processing..." : "Partial Return"}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-11 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>

      <PartialReturnDialog
        open={partialReturnOpen}
        onClose={() => setPartialReturnOpen(false)}
        document={data}
        onSubmit={async (items) => {
          try {
            await partialReturn({
              documentId: data.id,

              items,
            });

            setPartialReturnOpen(false);
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </div>
  );
}
