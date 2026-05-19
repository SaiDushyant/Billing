import { toast } from "sonner";

import { api } from "@/lib/api";

interface Props {
  documentId: string;
}

export default function DocumentActions({ documentId }: Props) {
  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this invoice?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.post(`/documents/${documentId}/cancel`);

      toast.success("Invoice cancelled");

      window.location.reload();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Cancellation failed";

      toast.error(message);
    }
  }

  async function handleReturn() {
    const reason = prompt("Enter return reason");

    if (!reason) {
      return;
    }

    try {
      await api.post(`/documents/${documentId}/return`, {
        reason,
      });

      toast.success("Invoice returned");

      window.location.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Return failed";

      toast.error(message);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCancel}
        className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
      >
        Cancel
      </button>

      <button
        onClick={handleReturn}
        className="rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
      >
        Return
      </button>
    </div>
  );
}
