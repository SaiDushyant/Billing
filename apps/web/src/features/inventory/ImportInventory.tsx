import {
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";

export default function ImportInventory() {
  const queryClient =
    useQueryClient();

  const [
    file,
    setFile,
  ] = useState<File | null>(
    null
  );

  const uploadMutation =
    useMutation({
      mutationFn: async () => {
        if (!file) {
          return;
        }

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await api.post(
            "/products/variants/import",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return response.data;
      },

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          {
            queryKey: [
              "inventory",
            ],
          }
        );

        setFile(null);
      },
    });

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) =>
          setFile(
            e.target
              .files?.[0] ||
              null
          )
        }
      />

      <Button
        disabled={
          !file ||
          uploadMutation.isPending
        }
        onClick={() =>
          uploadMutation.mutate()
        }
      >
        {uploadMutation.isPending
          ? "Uploading..."
          : "Upload"}
      </Button>
    </div>
  );
}