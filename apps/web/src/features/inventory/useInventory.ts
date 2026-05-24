import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { InventoryResponse } from "@/types/inventory";

interface UseInventoryOptions {
  search?: string;

  page?: number;

  limit?: number;

  category?: string;

  brand?: string;

  stockStatus?: string;
}

export function useInventory({
  search = "",
  page = 1,
  limit = 10,
  category = "",
  brand = "",
  stockStatus = "",
}: UseInventoryOptions) {
  return useQuery({
    queryKey: ["inventory", search, page, limit, category, brand, stockStatus],

    queryFn: async () => {
      const response = await api.get<InventoryResponse>("/inventory/overview", {
        params: {
          search,
          page,
          limit,
          category,
          brand,
          stockStatus,
        },
      });

      return response.data;
    },

    placeholderData: (previousData) => previousData,
  });
}
