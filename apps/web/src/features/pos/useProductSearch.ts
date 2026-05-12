import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { ProductVariant } from "@/types/product";

export function useProductSearch(search: string) {
  return useQuery({
    queryKey: ["product-search", search],

    queryFn: async () => {
      if (!search.trim()) {
        return [];
      }

      const response = await api.get<ProductVariant[]>(
        `/products/variants/search?search=${search}`,
      );

      return response.data;
    },

    enabled: search.trim().length > 0,
  });
}
