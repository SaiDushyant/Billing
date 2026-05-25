import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import { api } from "@/lib/api";

import { toast } from "sonner";

export function useDocumentActions() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // CANCEL
  const cancelMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await api.post(`/documents/${documentId}/cancel`);

      return response.data;
    },

    onSuccess: () => {
      toast.success("Document cancelled");

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
    },

    onError: () => {
      toast.error("Failed to cancel document");
    },
  });

  // RETURN
  const returnMutation = useMutation({
    mutationFn: async ({
      documentId,
      reason,
    }: {
      documentId: string;

      reason: string;
    }) => {
      const response = await api.post(`/documents/${documentId}/return`, {
        reason,
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Document returned");

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
    },

    onError: () => {
      toast.error("Failed to return document");
    },
  });

  // CONVERT QUOTATION
  const convertMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await api.post(
        `/documents/${documentId}/convert-to-invoice`,
      );

      return response.data;
    },

    onSuccess: () => {
      toast.success("Quotation converted to invoice");

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
    },

    onError: () => {
      toast.error("Conversion failed");
    },
  });

  // REBILL
  const rebillMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await api.post(`/documents/${documentId}/rebill`);

      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Rebill draft created");

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      navigate(`/documents/${data.id}`);
    },

    onError: () => {
      toast.error("Failed to create rebill");
    },
  });

  // PARTIAL RETURN
  const partialReturnMutation = useMutation({
    mutationFn: async ({
      documentId,
      items,
    }: {
      documentId: string;

      items: {
        documentItemId: string;

        quantity: number;

        reason:
          | "DAMAGED"
          | "CUSTOMER_RETURN"
          | "BILLING_ERROR"
          | "EXPIRED"
          | "OTHER";

        notes?: string;
      }[];
    }) => {
      const response = await api.post(
        `/documents/${documentId}/partial-return`,
        {
          items,
        },
      );

      return response.data;
    },

    // =========================
    // SUCCESS
    // =========================

    onSuccess: () => {
      toast.success("Partial return processed");

      // DOCUMENTS PAGE
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      // PREVIEW
      queryClient.invalidateQueries({
        queryKey: ["document"],
      });

      // INVENTORY
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      // DASHBOARD
      queryClient.invalidateQueries({
        queryKey: ["dashboard-analytics"],
      });
    },

    // =========================
    // ERROR
    // =========================

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to process return");
    },
  });

  return {
    cancelDocument: cancelMutation.mutate,

    isCancelling: cancelMutation.isPending,

    returnDocument: returnMutation.mutate,

    isReturning: returnMutation.isPending,

    convertQuotation: convertMutation.mutate,

    isConverting: convertMutation.isPending,

    rebillDocument: rebillMutation.mutate,

    isRebilling: rebillMutation.isPending,

    partialReturn: partialReturnMutation.mutateAsync,

    isPartialReturning: partialReturnMutation.isPending,
  };
}
