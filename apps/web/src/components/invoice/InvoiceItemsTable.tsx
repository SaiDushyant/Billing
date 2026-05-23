import { Plus } from "lucide-react";

import { useEffect } from "react";

import InvoiceRow from "./InvoiceRow";

import type { InvoiceItem, ProductSearchResult } from "@/types/invoice";

interface Props {
  items: InvoiceItem[];

  onUpdate: (id: string, updates: Partial<InvoiceItem>) => void;

  onSelectProduct: (rowId: string, product: ProductSearchResult) => void;

  onRemove: (id: string) => void;

  onAddRow: () => void;
}

export default function InvoiceItemsTable({
  items,
  onUpdate,
  onSelectProduct,
  onRemove,
  onAddRow,
}: Props) {
  // KEYBOARD SHORTCUT
  useEffect(() => {
    function handleShortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();

        onAddRow();
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [onAddRow]);

  return (
    <div className="overflow-visible rounded-2xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Invoice Items</h2>

            <p className="text-sm text-muted-foreground">
              Add products and quantities
            </p>
          </div>

          <button
            type="button"
            onClick={onAddRow}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="relative overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-225 w-full overflow-visible">
            <thead className="bg-slate-100 text-sm">
              <tr>
                <th className="p-4 text-left font-medium">Product</th>

                <th className="p-4 text-left font-medium">MRP</th>

                <th className="p-4 text-left font-medium">Landing Cost</th>

                <th className="p-4 text-left font-medium">Profit %</th>

                <th className="p-4 text-left font-medium">Rate</th>

                <th className="p-4 text-left font-medium">Qty</th>

                <th className="p-4 text-left font-medium">GST %</th>

                <th className="p-4 text-left font-medium">Total</th>

                <th className="p-4 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="overflow-visible">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center text-muted-foreground"
                  >
                    No items added
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <InvoiceRow
                    key={item.id}
                    item={item}
                    onUpdate={onUpdate}
                    onSelectProduct={onSelectProduct}
                    onRemove={onRemove}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="border-t bg-slate-50/80 px-6 py-4">
        <button
          type="button"
          onClick={onAddRow}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-black hover:bg-slate-50 hover:text-black"
        >
          <Plus size={18} />
          Add Another Item
          <span className="ml-2 rounded-md border bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
            Ctrl / ⌘ + Enter
          </span>
        </button>
      </div>
    </div>
  );
}
