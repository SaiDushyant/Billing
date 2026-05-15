import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { useAuthStore } from "@/store/auth.store";

import type { User } from "@/types/auth";

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const response = await api.get<User>("/auth/me");

      return response.data;
    },

    enabled: !!token,

    retry: false,
  });
}
