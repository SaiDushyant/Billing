import { useState } from "react";

import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import InventoryTable from "@/components/inventory/InventoryTable";

import EditVariantDialog from "@/components/inventory/EditVariantDialog";

import ImportInventory from "@/components/inventory/ImportInventory";

import InventoryStats from "@/components/inventory/InventoryStats";

import SearchableSelect from "@/components/ui/searchable-select";

import { useInventoryFilters } from "@/features/inventory/useInventoryFilters";

import { useInventory } from "@/features/inventory/useInventory";

import AddProductDialog from "@/components/inventory/AddProductDialog";
import type { InventoryVariant } from "@/types/inventory";

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [category, setCategory] = useState("");

  const [brand, setBrand] = useState("");

  const [stockStatus, setStockStatus] = useState("");

  const [selectedVariant, setSelectedVariant] =
    useState<InventoryVariant | null>(null);

  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isFetching } = useInventory({
    search,
    page,
    limit,
    category,
    brand,
    stockStatus,
  });

  const { categories, brands } = useInventoryFilters();

  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Inventory
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            Manage products, pricing and stock
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* IMPORT */}
          <div>
            <ImportInventory />
          </div>

          {/* ADD PRODUCT */}
          <Button
            onClick={() => setAddOpen(true)}
            className="h-12 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 px-6 text-white shadow-lg hover:opacity-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* STATS */}
      {data?.stats && <InventoryStats stats={data.stats} />}

      {/* FILTER BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto]">
          {/* SEARCH */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <Input
              placeholder="Search by product, SKU or barcode..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              className="h-12 rounded-2xl border-slate-200 pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <SearchableSelect
            value={category}
            onChange={(value) => {
              setCategory(value);

              setPage(1);
            }}
            placeholder="All Categories"
            searchPlaceholder="Search categories..."
            emptyText="No category found."
            options={[
              {
                label: "All Categories",

                value: "",
              },

              ...(categories.data?.map((category) => ({
                label: category.name,

                value: category.name,
              })) || []),
            ]}
          />

          {/* BRAND */}
          <SearchableSelect
            value={brand}
            onChange={(value) => {
              setBrand(value);

              setPage(1);
            }}
            placeholder="All Brands"
            searchPlaceholder="Search brands..."
            emptyText="No brand found."
            options={[
              {
                label: "All Brands",

                value: "",
              },

              ...(brands.data?.map((brand) => ({
                label: brand.name,

                value: brand.name,
              })) || []),
            ]}
          />

          {/* STATUS */}
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>

            <option value="IN_STOCK">In Stock</option>

            <option value="LOW_STOCK">Low Stock</option>

            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          {/* CLEAR */}
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");

              setCategory("");

              setBrand("");

              setStockStatus("");

              setPage(1);
            }}
            className="h-12 rounded-2xl border-slate-200 px-6"
          >
            Clear
          </Button>

          {/* APPLY */}
          <Button className="h-12 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 px-6 shadow-lg hover:opacity-95">
            <SlidersHorizontal className="mr-2" size={16} />
            Apply Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading inventory...</div>
      ) : (
        <>
          {isFetching && (
            <div className="text-sm text-muted-foreground">Refreshing...</div>
          )}

          <InventoryTable
            data={data?.items || []}
            onEdit={(variant) => setSelectedVariant(variant)}
          />

          {/* PAGINATION */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min((page - 1) * limit + 1, data?.total || 0)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(page * limit, data?.total || 0)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {data?.total || 0}
                </span>{" "}
                products
              </div>

              {/* PAGE SIZE */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Show</span>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));

                    setPage(1);
                  }}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>

                  <option value={25}>25</option>

                  <option value={50}>50</option>

                  <option value={100}>100</option>
                </select>

                <span className="text-sm text-slate-500">entries</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* PREVIOUS */}
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-10 rounded-xl border-slate-200 px-4"
              >
                Previous
              </Button>

              {/* PAGE NUMBERS */}
              <div className="flex items-center gap-2">
                {Array.from({
                  length: data?.totalPages || 1,
                })
                  .slice(Math.max(page - 3, 0), Math.max(page + 2, 5))
                  .map((_, index) => {
                    const pageNumber = Math.max(page - 2, 1) + index;

                    if (pageNumber > (data?.totalPages || 1)) {
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition ${
                          page === pageNumber
                            ? "border-blue-500 bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
              </div>

              {/* NEXT */}
              <Button
                variant="outline"
                disabled={page === data?.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 rounded-xl border-slate-200 px-4"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <EditVariantDialog
        key={selectedVariant?.id}
        open={!!selectedVariant}
        onClose={() => setSelectedVariant(null)}
        variant={selectedVariant}
      />
      <AddProductDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
