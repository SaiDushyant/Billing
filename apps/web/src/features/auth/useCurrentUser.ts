import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const response =
        await api.get("/me");

      return response.data.user;
    },

    retry: false,
  });
}