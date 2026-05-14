import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { InventoryResponse } from "@/types/inventory";

interface UseInventoryOptions {
  search?: string;

  page?: number;

  limit?: number;
}

export function useInventory({
  search = "",
  page = 1,
  limit = 10,
}: UseInventoryOptions) {
  return useQuery({
    queryKey: [
      "inventory",
      search,
      page,
      limit,
    ],

    queryFn: async () => {
      const response =
        await api.get<InventoryResponse>(
          "/products/variants",
          {
            params: {
              search,
              page,
              limit,
            },
          }
        );

      return response.data;
    },

    placeholderData: (
      previousData
    ) => previousData,
  });
}