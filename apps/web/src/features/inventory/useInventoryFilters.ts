import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

interface FilterItem {
  id: string;

  name: string;
}

export function useInventoryFilters() {
  const categories = useQuery({
    queryKey: ["inventory-categories"],

    queryFn: async () => {
      const response = await api.get<FilterItem[]>("/inventory/categories");

      return response.data;
    },
  });

  const brands = useQuery({
    queryKey: ["inventory-brands"],

    queryFn: async () => {
      const response = await api.get<FilterItem[]>("/inventory/brands");

      return response.data;
    },
  });

  return {
    categories,

    brands,
  };
}
