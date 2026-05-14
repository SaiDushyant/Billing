import { useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import InventoryTable from "@/features/inventory/InventoryTable";

import EditVariantDialog from "@/features/inventory/EditVariantDialog";

import ImportInventory from "@/features/inventory/ImportInventory";

import { useInventory } from "@/features/inventory/useInventory";

import type { InventoryVariant } from "@/types/inventory";

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [selectedVariant, setSelectedVariant] =
    useState<InventoryVariant | null>(null);

  const { data, isLoading, isFetching } = useInventory({
    search,
    page,
    limit: 10,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>

          <p className="text-muted-foreground">
            Manage products, pricing and stock
          </p>
        </div>

        <ImportInventory />
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by product, SKU or barcode..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Button variant="outline" onClick={() => setSearch("")}>
          Clear
        </Button>
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

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total Products: {data?.total || 0}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-sm">
                Page {page} of {data?.totalPages || 1}
              </span>

              <Button
                variant="outline"
                disabled={page === data?.totalPages || !data?.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <EditVariantDialog
        open={!!selectedVariant}
        onClose={() => setSelectedVariant(null)}
        variant={selectedVariant}
      />
    </div>
  );
}
