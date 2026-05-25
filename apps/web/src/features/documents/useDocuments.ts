import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

type Params = {
  search: string;

  type: string;

  status: string;

  startDate?: string;

  endDate?: string;

  page: number;

  limit: number;
};

export function useDocuments(params: Params) {
  return useQuery({
    queryKey: ["documents", params],

    queryFn: async () => {
      const response = await api.get("/documents", {
        params,
      });

      return response.data;
    },
  });
}
