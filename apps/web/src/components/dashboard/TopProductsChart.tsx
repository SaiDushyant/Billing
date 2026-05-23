import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardCard from "./DashboardCard";

interface Props {
  products: {
    name: string;

    quantity: number;
  }[];
}

export default function TopProductsChart({ products }: Props) {
  return (
    <DashboardCard className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Product Sales</h2>

          <p className="mt-1 text-sm text-slate-500">Top performing products</p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium">
          Live Analytics
        </div>
      </div>

      <div className="h-95">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={products}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="quantity" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
