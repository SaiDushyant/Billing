import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { api } from "@/lib/api";

import type { InventoryVariant } from "@/types/inventory";

interface Props {
  open: boolean;

  onClose: () => void;

  variant: InventoryVariant | null;
}

export default function EditVariantDialog({ open, onClose, variant }: Props) {
  const queryClient = useQueryClient();

  const [sellingPrice, setSellingPrice] = useState("");

  const [costPrice, setCostPrice] = useState("");

  const handleOpenChange = (value: boolean) => {
    if (value && variant) {
      setSellingPrice(String(variant.sellingPrice));

      setCostPrice(String(variant.costPrice));
    }

    if (!value) {
      onClose();
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!variant) {
        return;
      }

      await api.patch(`/products/variants/${variant.id}`, {
        sellingPrice: Number(sellingPrice),

        costPrice: Number(costPrice),
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Selling Price</Label>

            <Input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="Selling Price"
            />
          </div>

          <div className="space-y-2">
            <Label>Cost Price</Label>

            <Input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="Cost Price"
            />
          </div>

          <Button
            className="w-full"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
