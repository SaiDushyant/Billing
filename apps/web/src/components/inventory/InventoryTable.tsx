import { Pencil, Trash2 } from "lucide-react";

import type { InventoryVariant } from "@/types/inventory";

interface Props {
  data: InventoryVariant[];

  onEdit: (variant: InventoryVariant) => void;
}

export default function InventoryTable({ data, onEdit }: Props) {
  function getStatus(stock: number) {
    if (stock <= 0) {
      return {
        label: "Out of Stock",

        className: "bg-red-50 text-red-600 border-red-200",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",

        className: "bg-orange-50 text-orange-600 border-orange-200",
      };
    }

    return {
      label: "In Stock",

      className: "bg-green-50 text-green-600 border-green-200",
    };
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* HEADER */}
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-sm text-slate-600">
              <th className="px-6 py-4 text-left font-semibold">Product</th>

              <th className="px-6 py-4 text-left font-semibold">SKU</th>

              <th className="px-6 py-4 text-left font-semibold">Category</th>

              <th className="px-6 py-4 text-left font-semibold">Brand</th>

              <th className="px-6 py-4 text-left font-semibold">Stock</th>

              <th className="px-6 py-4 text-left font-semibold">Cost</th>

              <th className="px-6 py-4 text-left font-semibold">MRP</th>

              <th className="px-6 py-4 text-left font-semibold">Margin %</th>

              <th className="px-6 py-4 text-left font-semibold">Selling</th>

              <th className="px-6 py-4 text-left font-semibold">GST %</th>

              <th className="px-6 py-4 text-left font-semibold">Status</th>

              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-20 text-center text-slate-400">
                  No item found
                </td>
              </tr>
            ) : (
              data.map((variant) => {
                const status = getStatus(variant.currentStock);

                return (
                  <tr
                    key={variant.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80"
                  >
                    {/* PRODUCT */}
                    <td className="px-6 py-5">
                      <div>
                        <div className="font-semibold text-slate-800">
                          {variant.displayName}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          Product Variant
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {variant.sku}
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        {variant.product?.brand?.category?.name || "N/A"}
                      </span>
                    </td>

                    {/* BRAND */}
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {variant.product?.brand?.name || "N/A"}
                    </td>

                    {/* STOCK */}
                    <td className="px-6 py-5">
                      <span
                        className={`font-semibold ${
                          variant.currentStock <= 5
                            ? "text-red-500"
                            : "text-slate-800"
                        }`}
                      >
                        {variant.currentStock}
                      </span>
                    </td>

                    {/* COST */}
                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      ₹{Number(variant.costPrice).toFixed(2)}
                    </td>

                    {/* MRP */}
                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      ₹{Number(variant.mrp).toFixed(2)}
                    </td>

                    {/* MARGIN */}
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {Number(variant.profitMargin).toFixed(0)}%
                    </td>

                    {/* SELLING */}
                    <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                      ₹
                      {(
                        Number(variant.costPrice) *
                        (1 + Number(variant.profitMargin) / 100)
                      ).toFixed(2)}
                    </td>

                    {/* GST */}
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {Number(variant.gstRate).toFixed(0)}%
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() => onEdit(variant)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
