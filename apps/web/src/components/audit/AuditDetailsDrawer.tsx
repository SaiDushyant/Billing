import { X } from "lucide-react";

interface Props {
  open: boolean;

  onClose: () => void;

  log: any;
}

function JsonBlock({
  title,
  data,
}: {
  title: string;

  data: any;
}) {
  if (!data) {
    return null;
  }

  return (
    <div className="rounded-2xl border bg-slate-50 p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      <pre className="overflow-x-auto rounded-xl bg-black p-4 text-sm text-green-400">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default function AuditDetailsDrawer({ open, onClose, log }: Props) {
  if (!open || !log) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-99999 flex">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">{log.action}</h2>

            <p className="text-sm text-slate-500">{log.entityType}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5">
              <p className="text-sm text-slate-500">User</p>

              <p className="mt-2 text-lg font-bold">
                {log.user?.name || "System"}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-slate-500">Created At</p>

              <p className="mt-2 text-lg font-bold">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-slate-500">Entity Type</p>

              <p className="mt-2 text-lg font-bold">{log.entityType}</p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-slate-500">Entity ID</p>

              <p className="mt-2 break-all text-sm font-bold">
                {log.entityId || "-"}
              </p>
            </div>
          </div>

          {/* OLD DATA */}
          <JsonBlock title="Old Data" data={log.oldData} />

          {/* NEW DATA */}
          <JsonBlock title="New Data" data={log.newData} />

          {/* METADATA */}
          <JsonBlock title="Metadata" data={log.metadata} />
        </div>
      </div>
    </div>
  );
}
