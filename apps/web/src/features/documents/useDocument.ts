import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useDocument(documentId?: string) {
  return useQuery({
    queryKey: ["document", documentId],

    enabled: !!documentId,

    queryFn: async () => {
      const response = await api.get(`/documents/${documentId}`);

      return response.data;
    },
  });
}
