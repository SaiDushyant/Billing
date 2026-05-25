import { useEffect, useState } from "react";

import DocumentCard from "@/components/documents/DocumentCard";

import DocumentPreviewDrawer from "@/components/documents/DocumentPreviewDrawer";

import type { DocumentItem } from "@/types/document";

import { useDocuments } from "@/features/documents/useDocuments";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [type, setType] = useState("ALL");

  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null,
  );

  const [previewOpen, setPreviewOpen] = useState(false);

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching } = useDocuments({
    search: debouncedSearch,

    type,

    status,

    page,

    limit,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  function handleViewDocument(document: DocumentItem) {
    setSelectedDocument(document);

    setPreviewOpen(true);
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>

        <p className="text-muted-foreground">
          Billing history and invoice lifecycle
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* TYPE TABS */}
        <div className="flex flex-wrap gap-3">
          {["ALL", "DRAFT", "QUOTATION", "BILL", "INVOICE"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setType(tab);

                setPage(1);
              }}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                type === tab
                  ? "bg-blue-600 text-white shadow"
                  : "border bg-white hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* RIGHT FILTERS */}
        <div className="flex flex-wrap gap-3">
          {/* SEARCH */}
          <input
            placeholder="Search customer or invoice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setPage(1);
            }}
            className="h-11 w-80 rounded-xl border bg-white px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* STATUS FILTER */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);

              setPage(1);
            }}
            className="h-11 rounded-xl border bg-white px-4"
          >
            <option value="ALL">All Status</option>

            <option value="COMPLETED">Completed</option>

            <option value="CANCELLED">Cancelled</option>

            <option value="RETURNED">Returned</option>
          </select>

          {/* LIMIT */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));

              setPage(1);
            }}
            className="h-11 rounded-xl border bg-white px-4"
          >
            <option value={10}>10 / page</option>

            <option value={20}>20 / page</option>

            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {isFetching && (
        <div className="text-sm text-muted-foreground">Refreshing...</div>
      )}

      {/* DOCUMENTS */}
      <div className="space-y-4">
        {data?.items.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onView={handleViewDocument}
          />
        ))}
      </div>

      {/* EMPTY */}
      {data?.items.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
          No documents found
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total Documents: {data?.total || 0}
        </div>

        <div className="flex items-center gap-4">
          {/* PAGE SIZE */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));

              setPage(1);
            }}
            className="h-10 rounded-xl border bg-white px-3"
          >
            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={50}>50</option>
          </select>

          {/* BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {page} of {data?.totalPages || 1}
            </span>

            <button
              disabled={page === data?.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <DocumentPreviewDrawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentId={selectedDocument?.id}
      />
    </div>
  );
}
