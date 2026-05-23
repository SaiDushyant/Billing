import {
  DollarSign,
  Package,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  totalRevenue: number;

  totalGST: number;

  totalSales: number;

  totalProductsSold: number;
}

const cards = [
  {
    key: "revenue",

    title: "Total Revenue",

    icon: DollarSign,

    gradient: "from-blue-500 to-cyan-400",
  },

  {
    key: "gst",

    title: "GST Collected",

    icon: Receipt,

    gradient: "from-emerald-500 to-green-400",
  },

  {
    key: "sales",

    title: "Total Sales",

    icon: ShoppingCart,

    gradient: "from-violet-500 to-purple-400",
  },

  {
    key: "products",

    title: "Products Sold",

    icon: Package,

    gradient: "from-orange-500 to-amber-400",
  },
];

export default function DashboardStatCards({
  totalRevenue,

  totalGST,

  totalSales,

  totalProductsSold,
}: Props) {
  const values = {
    revenue: `₹${totalRevenue.toFixed(2)}`,

    gst: `₹${totalGST.toFixed(2)}`,

    sales: totalSales,

    products: totalProductsSold,
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <DashboardCard key={card.key} className="overflow-hidden p-0">
            <div className={`bg-linear-to-br ${card.gradient} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/80">{card.title}</p>

                  <h2 className="mt-3 text-4xl font-bold tracking-tight">
                    {values[card.key as keyof typeof values]}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                  <Icon size={28} />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm">
                <TrendingUp size={16} />

                <span>+12.4% from last period</span>
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}
