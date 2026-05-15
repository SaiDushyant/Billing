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

  const [costPrice, setCostPrice] = useState(
    variant ? String(variant.costPrice) : "",
  );

  const [mrp, setMrp] = useState(variant ? String(variant.mrp) : "");

  const [profitMargin, setProfitMargin] = useState(
    variant ? String(variant.profitMargin) : "",
  );

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!variant) {
        return;
      }

      await api.patch(`/products/variants/${variant.id}`, {
        costPrice: Number(costPrice),

        mrp: Number(mrp),

        profitMargin: Number(profitMargin),
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cost Price</Label>

            <Input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>MRP</Label>

            <Input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Profit Margin %</Label>

            <Input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
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
