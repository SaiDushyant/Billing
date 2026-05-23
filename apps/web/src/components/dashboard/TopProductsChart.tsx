import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  products: {
    name: string;

    quantity: number;
  }[];
}

export default function TopProductsChart({ products }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products Sales</h2>

        <select className="rounded-lg border px-3 py-2 text-sm">
          <option>Top 5</option>

          <option>Top 10</option>
        </select>
      </div>

      <div className="h-87.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={products}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="quantity" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
