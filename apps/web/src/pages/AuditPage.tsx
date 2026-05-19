import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { Card, CardContent } from "@/components/ui/card";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;

  user?: {
    name?: string;
  };
};

export default function AuditPage() {
  const { data, isLoading } = useQuery<AuditLog[]>({
    queryKey: ["audit-logs"],

    queryFn: async () => {
      const response = await api.get("/audit");

      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>

        <p className="text-muted-foreground">
          System activity and security tracking
        </p>
      </div>

      <div className="space-y-4">
        {data?.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{log.action}</span>

                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {log.entityType}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    User: {log.user?.name || "System"}
                  </p>

                  {log.entityId && (
                    <p className="text-sm">Entity ID: {log.entityId}</p>
                  )}
                </div>

                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
