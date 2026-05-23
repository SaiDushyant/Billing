import { RotateCcw } from "lucide-react";

interface Props {
  startDate: string;

  endDate: string;

  topProductsCount: number;

  onStartDateChange: (value: string) => void;

  onEndDateChange: (value: string) => void;

  onTopProductsChange: (value: number) => void;

  onApply?: () => void;

  onReset?: () => void;
}

export default function DashboardFilters({
  startDate,

  endDate,

  topProductsCount,

  onStartDateChange,

  onEndDateChange,

  onTopProductsChange,

  onApply,

  onReset,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* DATE */}
      <div className="flex h-12 items-center rounded-xl border bg-white shadow-sm">
        <div className="border-r px-4 text-sm font-medium">Custom Date</div>

        <div className="flex items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-12 rounded-xl border bg-white px-4 shadow-sm outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-12 rounded-xl border bg-white px-4 shadow-sm outline-none"
          />
        </div>
      </div>

      {/* SALES FILTER */}
      <select
        className="h-12 rounded-xl border bg-white px-4 text-sm shadow-sm outline-none"
        value={topProductsCount}
        onChange={(e) => onTopProductsChange(Number(e.target.value))}
      >
        <option value={5}>Top 5</option>

        <option value={10}>Top 10</option>

        <option value={15}>Top 15</option>
      </select>

      {/* AMOUNT FILTER */}
      <select className="h-12 rounded-xl border bg-white px-4 text-sm shadow-sm outline-none">
        <option>Amount - All</option>
      </select>

      {/* APPLY */}
      <button
        type="button"
        onClick={onApply}
        className="ml-auto flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 font-medium text-white shadow-sm transition hover:bg-blue-700"
      >
        Apply Filters
      </button>

      {/* RESET */}
      <button
        type="button"
        onClick={onReset}
        className="flex h-12 items-center gap-2 rounded-xl border bg-white px-5 font-medium shadow-sm transition hover:bg-slate-50"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}
