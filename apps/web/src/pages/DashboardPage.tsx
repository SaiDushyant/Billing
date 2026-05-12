import { Card, CardContent } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useDashboardAnalytics } from "@/features/analytics/useDashboardAnalytics";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardAnalytics();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">ERP Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Revenue</h3>

            <p className="text-3xl font-bold mt-2">
              ₹{data.totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">GST Collected</h3>

            <p className="text-3xl font-bold mt-2">
              ₹{data.totalGST.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500">Sales</h3>

            <p className="text-3xl font-bold mt-2">{data.totalSales}</p>
          </CardContent>
        </Card>
      </div>

      {/* TOP PRODUCTS */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-bold text-xl mb-4">Top Products</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
