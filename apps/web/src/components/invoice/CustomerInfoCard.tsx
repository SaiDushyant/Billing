import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { api } from "@/lib/api";

import type { Customer } from "@/types/customer";

interface Props {
  customer: Customer;

  onChange: (customer: Customer) => void;

  onSaveCustomer: () => void;

  isSavingCustomer?: boolean;
}

export default function CustomerInfoCard({
  customer,

  onChange,

  onSaveCustomer,

  isSavingCustomer,
}: Props) {
  const [search, setSearch] = useState("");

  const [results, setResults] = useState<Customer[]>([]);

  const [showDropdown, setShowDropdown] = useState(false);

  async function searchCustomers(value: string) {
    try {
      if (!value.trim()) {
        setResults([]);

        return;
      }

      const response = await api.get(`/customers/search?search=${value}`);

      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchCustomers(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleSelectCustomer(selected: Customer) {
    onChange(selected);

    setSearch(selected.name);

    setShowDropdown(false);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-slate-800">
            Customer Details
          </h2>

          <p className="text-xs text-muted-foreground">
            Search existing or create customer
          </p>
        </div>

        <button
          type="button"
          onClick={onSaveCustomer}
          disabled={isSavingCustomer || !customer.name.trim()}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSavingCustomer
            ? "Saving..."
            : customer.id
              ? "Update Customer"
              : "Save Customer"}
        </button>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        {/* SEARCH */}
        <div className="relative space-y-1 lg:col-span-2">
          <label className="text-xs font-medium text-slate-500">
            Search Customer
          </label>

          <Input
            placeholder="Search by name, phone or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setShowDropdown(true);
            }}
          />

          {/* DROPDOWN */}
          {showDropdown && results.length > 0 && (
            <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border bg-white shadow-lg">
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelectCustomer(result)}
                  className="w-full border-b p-3 text-left hover:bg-slate-100"
                >
                  <div className="font-medium">{result.name}</div>

                  <div className="text-sm text-muted-foreground">
                    {result.phone}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NAME */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Customer Name
          </label>

          <Input
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              onChange({
                ...customer,

                name: e.target.value,
              })
            }
          />
        </div>

        {/* PHONE */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Phone Number
          </label>

          <Input
            placeholder="Phone Number"
            value={customer.phone || ""}
            onChange={(e) =>
              onChange({
                ...customer,

                phone: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-4">
        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Email</label>

          <Input
            placeholder="Email"
            value={customer.email || ""}
            onChange={(e) =>
              onChange({
                ...customer,

                email: e.target.value,
              })
            }
          />
        </div>

        {/* GST */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            GST Number
          </label>

          <Input
            placeholder="GST Number"
            value={customer.gstNumber || ""}
            onChange={(e) =>
              onChange({
                ...customer,

                gstNumber: e.target.value,
              })
            }
          />
        </div>

        {/* ADDRESS */}
        <div className="space-y-1 lg:col-span-2">
          <label className="text-xs font-medium text-slate-500">Address</label>

          <Input
            placeholder="Address"
            value={customer.address || ""}
            onChange={(e) =>
              onChange({
                ...customer,

                address: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
