import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useCustomerLedger(customerId?: string) {
  return useQuery({
    enabled: !!customerId,

    queryKey: ["customer-ledger", customerId],

    queryFn: async () => {
      const response = await api.get(
        `/documents/customer/${customerId}/ledger`,
      );

      return response.data;
    },
  });
}
