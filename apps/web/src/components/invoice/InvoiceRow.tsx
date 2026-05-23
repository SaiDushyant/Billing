import { Trash2 } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { useProductSearch } from "@/features/pos/useProductSearch";

import type { InvoiceItem, ProductSearchResult } from "@/types/invoice";

import { formatCurrency } from "@/utils/invoice";

interface Props {
  item: InvoiceItem;

  onUpdate: (id: string, updates: Partial<InvoiceItem>) => void;

  onSelectProduct: (rowId: string, product: ProductSearchResult) => void;

  onRemove: (id: string) => void;
}

export default function InvoiceRow({
  item,
  onUpdate,
  onSelectProduct,
  onRemove,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,

    left: 0,

    width: 0,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(item.search || "");

  const [selectedIndex, setSelectedIndex] = useState(0);

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(item.search || "");
    }, 200);

    return () => clearTimeout(timeout);
  }, [item.search]);

  // FETCH PRODUCTS
  const { data: rawProducts = [] } = useProductSearch(debouncedSearch);

  // FILTER PRODUCTS
  const filteredProducts: ProductSearchResult[] = useMemo(() => {
    const search = debouncedSearch.toLowerCase();

    const normalizedProducts = rawProducts.map((product) => ({
      id: product.id,

      displayName: product.displayName,

      sku: product.sku,

      barcode: product.barcode,

      mrp: Number(product.mrp),

      gstRate: Number(product.gstRate),

      sellingPrice: Number(product.sellingPrice),

      costPrice: Number(product.costPrice),

      profitMargin: Number(product.profitMargin),
    }));

    if (!search.trim()) {
      return normalizedProducts.slice(0, 20);
    }

    return normalizedProducts
      .filter((product) => {
        return (
          product.displayName.toLowerCase().includes(search) ||
          product.sku.toLowerCase().includes(search) ||
          product.barcode.includes(search)
        );
      })
      .slice(0, 20);
  }, [rawProducts, debouncedSearch]);

  // FOLLOW INPUT POSITION
  useEffect(() => {
    let frameId: number;

    function updatePosition() {
      if (item.showDropdown && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();

        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,

          left: rect.left + window.scrollX,

          width: rect.width,
        });
      }

      frameId = requestAnimationFrame(updatePosition);
    }

    updatePosition();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [item.showDropdown]);

  // CLICK OUTSIDE
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        onUpdate(item.id, {
          showDropdown: false,
        });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [item.id, onUpdate]);

  // RESET SELECTED INDEX
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedSearch]);

  // KEYBOARD NAVIGATION
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!item.showDropdown) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        Math.min(prev + 1, filteredProducts.length - 1),
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const selected = filteredProducts[selectedIndex];

      if (selected) {
        onSelectProduct(item.id, selected);
      }
    }

    if (e.key === "Escape") {
      onUpdate(item.id, {
        showDropdown: false,
      });
    }
  }

  return (
    <tr className="border-b">
      {/* PRODUCT */}
      <td className="w-[320px] p-3 align-top">
        <div ref={wrapperRef} className="relative">
          <input
            ref={inputRef}
            value={item.search || ""}
            placeholder="Search product, SKU, barcode..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-slate-100"
            onFocus={() =>
              onUpdate(item.id, {
                showDropdown: true,
              })
            }
            onKeyDown={handleKeyDown}
            onChange={(e) =>
              onUpdate(item.id, {
                search: e.target.value,

                showDropdown: true,
              })
            }
          />
        </div>

        {item.showDropdown &&
          createPortal(
            <div
              ref={dropdownRef}
              className="absolute z-99999 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              style={{
                top: dropdownPosition.top,

                left: dropdownPosition.left,

                width: Math.max(dropdownPosition.width, 420),
              }}
            >
              {/* HEADER */}
              <div className="border-b bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Product Search
              </div>

              {/* RESULTS */}
              <div className="max-h-80 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">
                    No products found
                  </div>
                ) : (
                  filteredProducts.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      className={`w-full border-b p-3 text-left transition ${
                        index === selectedIndex
                          ? "bg-black text-white"
                          : "hover:bg-slate-50"
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => onSelectProduct(item.id, product)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">
                            {product.displayName}
                          </div>

                          <div
                            className={`mt-1 text-xs ${
                              index === selectedIndex
                                ? "text-slate-300"
                                : "text-muted-foreground"
                            }`}
                          >
                            SKU: {product.sku}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {formatCurrency(Number(product.sellingPrice))}
                          </div>

                          <div
                            className={`mt-1 text-xs ${
                              index === selectedIndex
                                ? "text-slate-300"
                                : "text-muted-foreground"
                            }`}
                          >
                            GST {product.gstRate}%
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t bg-slate-50 px-4 py-2 text-xs text-slate-500">
                ↑ ↓ navigate • Enter select • Esc close
              </div>
            </div>,
            document.body,
          )}
      </td>

      {/* MRP */}
      <td className="w-36 p-3">
        <input
          type="number"
          value={item.mrp || 0}
          className="w-full rounded-lg border p-2"
          onChange={(e) =>
            onUpdate(item.id, {
              mrp: Number(e.target.value),
            })
          }
        />
      </td>

      {/* Landing Cost */}
      <td className="w-36 p-3">
        <input
          type="number"
          value={item.costPrice || 0}
          className="w-full rounded-lg border p-2"
          onChange={(e) =>
            onUpdate(item.id, {
              costPrice: Number(e.target.value),
            })
          }
        />
      </td>

      {/* PROFIT */}
      <td className="w-32 p-3">
        <input
          type="number"
          value={item.profitMargin || 0}
          className="w-full rounded-lg border p-2"
          onChange={(e) =>
            onUpdate(item.id, {
              profitMargin: Number(e.target.value),
            })
          }
        />
      </td>

      {/* RATE */}
      <td className="w-37.5 p-3">
        <input
          type="number"
          value={item.unitPrice}
          className="w-full rounded-lg border p-2"
          onChange={(e) =>
            onUpdate(item.id, {
              unitPrice: Number(e.target.value),
            })
          }
        />
      </td>

      {/* QUANTITY */}
      <td className="w-30 p-3">
        <input
          type="number"
          min={1}
          value={item.quantity}
          className="w-full rounded-lg border p-2"
          onChange={(e) =>
            onUpdate(item.id, {
              quantity: Number(e.target.value),
            })
          }
        />
      </td>

      {/* GST */}
      <td className="w-30 p-3">
        <input
          type="number"
          value={item.gstRate}
          className="w-full rounded-lg border p-2"
          onChange={(e) =>
            onUpdate(item.id, {
              gstRate: Number(e.target.value),
            })
          }
        />
      </td>

      {/* TOTAL */}
      <td className="w-40 p-3 font-semibold">
        {formatCurrency(item.lineTotal)}
      </td>

      {/* REMOVE */}
      <td className="w-20 p-3">
        <button
          type="button"
          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
