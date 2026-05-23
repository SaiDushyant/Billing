import { DollarSign, Package, Receipt, ShoppingCart } from "lucide-react";

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

    bg: "bg-blue-500",
  },

  {
    key: "gst",

    title: "GST Collected",

    icon: Receipt,

    bg: "bg-green-500",
  },

  {
    key: "sales",

    title: "Total Sales",

    icon: ShoppingCart,

    bg: "bg-purple-500",
  },

  {
    key: "products",

    title: "Products Sold",

    icon: Package,

    bg: "bg-orange-500",
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
          <div
            key={card.key}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${card.bg}`}
              >
                <Icon size={26} />
              </div>

              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {values[card.key as keyof typeof values]}
                </h2>

                <p className="mt-2 text-sm text-green-500">
                  ▲ 12.4% vs last period
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
