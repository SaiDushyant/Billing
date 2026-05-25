import { useEffect, useState } from "react";

import {
  getAuditColors,
  getAuditIcon,
  getModuleBadgeColor,
} from "@/utils/audit";

import { CalendarDays, Clock3, Download, Filter, Search } from "lucide-react";

import AuditDetailsDrawer from "@/components/audit/AuditDetailsDrawer";
import { useAuditLogs } from "@/features/audit/useAuditLogs";
import { exportAuditLogs } from "@/features/audit/useExportAuditLogs";
import { generatePagination } from "@/utils/pagination";

export default function AuditPage() {
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [action, setAction] = useState("ALL");

  const [entityType, setEntityType] = useState("ALL");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // =========================
  // DEBOUNCE SEARCH
  // =========================

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // =========================
  // FETCH LOGS
  // =========================

  const { data, isLoading, isFetching } = useAuditLogs({
    search: debouncedSearch,

    action,

    entityType,

    page,

    limit,

    startDate,

    endDate,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const pagination = generatePagination(page, data?.totalPages || 1);

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-slate-500">
            System activity and security tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              exportAuditLogs({
                search,

                action,

                entityType,

                startDate,

                endDate,
              })
            }
            className="flex h-11 items-center gap-2 rounded-xl border bg-white px-5 text-sm font-medium transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT FILTERS */}
        <div className="flex flex-wrap gap-3">
          {/* DATE RANGE */}
          <div className="flex items-center gap-2 rounded-2xl border bg-white px-4">
            <CalendarDays className="h-4 w-4 text-slate-500" />

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);

                setPage(1);
              }}
              className="h-11 bg-transparent text-sm outline-none"
            />

            <span className="text-slate-400">-</span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);

                setPage(1);
              }}
              className="h-11 bg-transparent text-sm outline-none"
            />
          </div>

          {/* ACTION FILTER */}
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);

              setPage(1);
            }}
            className="h-11 rounded-2xl border bg-white px-4 text-sm"
          >
            <option value="ALL">All Actions</option>

            <option value="CREATE">Create</option>

            <option value="UPDATE">Update</option>

            <option value="DELETE">Delete</option>

            <option value="SALE">Sale</option>

            <option value="RETURN">Return</option>

            <option value="CANCEL">Cancel</option>

            <option value="LOGIN">Login</option>

            <option value="LOGOUT">Logout</option>
          </select>

          {/* MODULE FILTER */}
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);

              setPage(1);
            }}
            className="h-11 rounded-2xl border bg-white px-4 text-sm"
          >
            <option value="ALL">All Modules</option>

            <option value="DOCUMENT">Document</option>

            <option value="INVENTORY">Inventory</option>

            <option value="CUSTOMER">Customer</option>

            <option value="PAYMENT">Payment</option>

            <option value="AUTH">Auth</option>
          </select>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-wrap gap-3">
          {/* SEARCH */}
          <div className="flex h-11 items-center gap-2 rounded-2xl border bg-white px-4">
            <Search className="h-4 w-4 text-slate-400" />

            <input
              placeholder="Search user or entity ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              className="w-72 bg-transparent text-sm outline-none"
            />
          </div>

          {/* EXPORT */}
          <button className="flex h-11 items-center gap-2 rounded-2xl border bg-white px-5 text-sm font-medium transition hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export
          </button>

          {/* FILTER BUTTON */}
          <button className="flex h-11 items-center gap-2 rounded-2xl border bg-white px-5 text-sm font-medium transition hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* REFRESHING */}
      {isFetching && (
        <div className="text-sm text-slate-500">Refreshing...</div>
      )}

      {/* AUDIT LIST */}
      <div className="space-y-4">
        {data?.items.map((log) => {
          const Icon = getAuditIcon(log.action);

          const colors = getAuditColors(log.action);

          return (
            <div
              key={log.id}
              onClick={() => {
                setSelectedLog(log);

                setDrawerOpen(true);
              }}
              className={`rounded-3xl border border-slate-200 border-l-4 bg-white p-6 shadow-sm cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg ${colors.border}`}
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                {/* LEFT */}
                <div className="flex items-start gap-5">
                  {/* ICON */}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors.bg}`}
                  >
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>

                  {/* CONTENT */}
                  <div className="space-y-3">
                    {/* TOP */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold">{log.action}</h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getModuleBadgeColor(
                          log.entityType,
                        )}`}
                      >
                        {log.entityType}
                      </span>
                    </div>

                    {/* USER */}
                    <p className="text-slate-500">
                      User: {log.user?.name || "System"}
                    </p>

                    {/* ENTITY */}
                    {log.entityId && (
                      <p className="text-sm text-slate-500">
                        Entity ID: {log.entityId}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-3 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />

                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* TOTAL */}
        <div className="text-sm text-slate-500">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, data?.total || 0)} of {data?.total || 0}{" "}
          entries
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          {/* PAGE SIZE */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));

              setPage(1);
            }}
            className="h-10 rounded-xl border bg-white px-3 text-sm"
          >
            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={50}>50</option>
          </select>

          {/* BUTTONS */}
          <div className="flex items-center gap-2">
            {/* PREVIOUS */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-10 rounded-xl border bg-white px-4 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}
            {pagination.map((item, index) =>
              item === "..." ? (
                <div
                  key={index}
                  className="flex h-10 w-10 items-center justify-center text-sm text-slate-400"
                >
                  ...
                </div>
              ) : (
                <button
                  key={index}
                  onClick={() => setPage(Number(item))}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition ${
                    page === item
                      ? "bg-blue-600 text-white shadow"
                      : "border bg-white hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            {/* NEXT */}
            <button
              disabled={page === data?.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-10 rounded-xl border bg-white px-4 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AuditDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}
