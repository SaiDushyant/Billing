import {
  
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import type { InventoryVariant } from "@/types/inventory";

interface Props {
  data: InventoryVariant[];

  onEdit: (
    variant: InventoryVariant
  ) => void;
}

export default function InventoryTable({
  data,
  onEdit,
}: Props) {
  const columns: ColumnDef<InventoryVariant>[] =
    [
      {
        accessorKey:
          "displayName",

        header: "Product",
      },

      {
        accessorKey: "sku",

        header: "SKU",
      },

      {
        accessorKey:
          "barcode",

        header: "Barcode",
      },

      {
        accessorKey:
          "currentStock",

        header: "Stock",

        cell: ({ row }) => {
          const stock =
            row.original
              .currentStock;

          return (
            <span
              className={
                stock <= 5
                  ? "text-red-600 font-medium"
                  : ""
              }
            >
              {stock}
            </span>
          );
        },
      },

      {
        accessorKey:
          "sellingPrice",

        header: "Price",

        cell: ({ row }) => {
          return `₹${Number(
            row.original
              .sellingPrice
          ).toFixed(2)}`;
        },
      },

      {
        accessorKey:
          "gstRate",

        header: "GST %",

        cell: ({ row }) => {
          return `${row.original.gstRate}%`;
        },
      },

      {
        id: "brand",

        header: "Brand",

        cell: ({ row }) =>
          row.original.product
            .brand.name,
      },

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onEdit(
                row.original
              )
            }
          >
            Edit
          </Button>
        ),
      },
    ];

  const table =
    useReactTable({
      data,

      columns,

      getCoreRowModel:
        getCoreRowModel(),
    });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table
            .getHeaderGroups()
            .map(
              (
                headerGroup
              ) => (
                <TableRow
                  key={
                    headerGroup.id
                  }
                >
                  {headerGroup.headers.map(
                    (
                      header
                    ) => (
                      <TableHead
                        key={
                          header.id
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header
                                .column
                                .columnDef
                                .header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  )}
                </TableRow>
              )
            )}
        </TableHeader>

        <TableBody>
          {table
            .getRowModel()
            .rows.length ? (
            table
              .getRowModel()
              .rows.map(
                (row) => (
                  <TableRow
                    key={row.id}
                  >
                    {row
                      .getVisibleCells()
                      .map(
                        (
                          cell
                        ) => (
                          <TableCell
                            key={
                              cell.id
                            }
                          >
                            {flexRender(
                              cell
                                .column
                                .columnDef
                                .cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      )}
                  </TableRow>
                )
              )
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  columns.length
                }
                className="h-24 text-center"
              >
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}