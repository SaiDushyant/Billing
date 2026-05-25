import { api } from "@/lib/api";

type Params = {
  search: string;

  action: string;

  entityType: string;

  startDate?: string;

  endDate?: string;
};

export async function exportAuditLogs(params: Params) {
  const response = await api.get("/audit/export", {
    params,

    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");

  link.href = url;

  link.setAttribute("download", "audit-logs.csv");

  document.body.appendChild(link);

  link.click();

  link.remove();
}
