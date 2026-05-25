import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { AuditLogsResponse } from "@/types/audit";

type Params = {
  page: number;

  limit: number;

  search: string;

  action: string;

  entityType: string;

  startDate?: string;

  endDate?: string;
};

export function useAuditLogs(params: Params) {
  return useQuery({
    queryKey: ["audit-logs", params],

    queryFn: async () => {
      const response = await api.get<AuditLogsResponse>("/audit", {
        params,
      });

      return response.data;
    },
  });
}
