import InvoiceRow from "./InvoiceRow";

import type { InvoiceItem, ProductSearchResult } from "@/types/invoice";

interface Props {
  items: InvoiceItem[];

  products: ProductSearchResult[];

  onUpdate: (id: string, updates: Partial<InvoiceItem>) => void;

  onSelectProduct: (rowId: string, product: ProductSearchResult) => void;

  onRemove: (id: string) => void;

  onAddRow: () => void;
}

export default function InvoiceItemsTable({
  items,
  products,
  onUpdate,
  onSelectProduct,
  onRemove,
  onAddRow,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-visible">
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
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="relative overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-225 overflow-visible">
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
                    colSpan={6}
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
                    products={products}
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
    </div>
  );
}
