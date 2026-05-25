import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { api } from "@/lib/api";

export function useAddPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,

      amount,

      method,

      referenceNumber,
    }: {
      documentId: string;

      amount: number;

      method: string;

      referenceNumber?: string;
    }) => {
      const response = await api.post(`/documents/${documentId}/payments`, {
        amount,

        method,

        referenceNumber,
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Payment added");

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add payment");
    },
  });
}
