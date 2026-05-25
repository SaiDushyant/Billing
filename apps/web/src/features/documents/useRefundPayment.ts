import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { api } from "@/lib/api";

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,

      paymentId,

      amount,

      reason,
    }: {
      documentId: string;

      paymentId: string;

      amount: number;

      reason: string;
    }) => {
      const response = await api.post(`/documents/${documentId}/refund`, {
        paymentId,

        amount,

        reason,
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Refund processed");

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["document"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Refund failed");
    },
  });
}
