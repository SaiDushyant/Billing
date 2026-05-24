import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useInventoryAnalytics() {
  return useQuery({
    queryKey: ["inventory-analytics"],

    queryFn: async () => {
      const response = await api.get("/analytics/inventory");

      return response.data;
    },
  });
}
