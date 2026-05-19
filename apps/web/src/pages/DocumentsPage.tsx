import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { Card, CardContent } from "@/components/ui/card";

import DocumentActions from "@/components/DocumentActions";

type Document = {
  id: string;

  type: string;

  status: string;

  grandTotal: string;

  createdAt: string;

  customer?: {
    name: string;
  };
};

export default function DocumentsPage() {
  const { data, isLoading } = useQuery<Document[]>({
    queryKey: ["documents"],

    queryFn: async () => {
      const response = await api.get("/documents");

      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>

        <p className="text-muted-foreground">
          Billing history and invoice lifecycle
        </p>
      </div>

      <div className="space-y-4">
        {data?.map((document) => (
          <Card key={document.id}>
            <CardContent className="p-4">
              <div className="flex justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{document.type}</h2>

                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">
                      {document.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Customer: {document.customer?.name || "Walk-in Customer"}
                  </p>

                  <p className="text-sm">
                    Total: ₹{Number(document.grandTotal).toFixed(2)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(document.createdAt).toLocaleString()}
                  </p>
                </div>

                <DocumentActions documentId={document.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
