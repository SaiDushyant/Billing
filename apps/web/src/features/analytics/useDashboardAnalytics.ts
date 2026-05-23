import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { DashboardAnalytics } from "@/types/analytics";

interface Props {
  startDate?: string;

  endDate?: string;

  top?: number;
}

export function useDashboardAnalytics({
  startDate,

  endDate,

  top = 5,
}: Props) {
  return useQuery<DashboardAnalytics>({
    queryKey: ["dashboard-analytics", startDate, endDate, top],

    queryFn: async () => {
      const response = await api.get("/analytics/dashboard", {
        params: {
          startDate,

          endDate,

          top,
        },
      });

      return response.data;
    },
  });
}
