import DashboardFilters from "@/components/dashboard/DashboardFilters";

import DashboardStatCards from "@/components/dashboard/DashboardStatCards";

import TopProductsChart from "@/components/dashboard/TopProductsChart";

import TopCustomersCard from "@/components/dashboard/TopCustomersCard";

import TopPlacesCard from "@/components/dashboard/TopPlacesCard";

import RecentSalesTable from "@/components/dashboard/RecentSalesTable";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { useDashboardAnalytics } from "@/features/analytics/useDashboardAnalytics";
import { useState } from "react";

export default function DashboardPage() {
  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [topProductsCount, setTopProductsCount] = useState(5);
  const { data, isLoading } = useDashboardAnalytics({
    startDate,

    endDate,

    top: topProductsCount,
  });

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-slate-200 p-6">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-2 text-slate-500">
          Monitor sales, analytics, and business performance
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-6">
        <DashboardFilters
          startDate={startDate}
          endDate={endDate}
          topProductsCount={topProductsCount}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onTopProductsChange={setTopProductsCount}
          onReset={() => {
            setStartDate("");

            setEndDate("");

            setTopProductsCount(5);
          }}
        />
      </div>

      {/* STATS */}
      <div className="mb-6">
        <DashboardStatCards
          totalRevenue={data.totalRevenue}
          totalGST={data.totalGST}
          totalSales={data.totalSales}
          totalProductsSold={data.totalProductsSold}
        />
      </div>

      {/* CHART + SIDEBARS */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr_0.8fr]">
        {/* CHART */}
        <TopProductsChart products={data.topProducts} />

        {/* CUSTOMERS */}
        <TopCustomersCard customers={data.topCustomers} />

        {/* PLACES */}
        <TopPlacesCard places={data.topPlaces} />
      </div>

      {/* RECENT SALES */}
      <RecentSalesTable sales={data.recentSales} />
    </div>
  );
}
