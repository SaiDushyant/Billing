import { AlertTriangle, Boxes, IndianRupee, PackageX } from "lucide-react";

interface Props {
  stats: {
    totalProducts: number;

    lowStock: number;

    outOfStock: number;

    inventoryValue: number;
  };
}

export default function InventoryStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Products",

      value: stats.totalProducts,

      icon: Boxes,

      gradient: "from-blue-500 to-indigo-600",

      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    },

    {
      title: "Low Stock",

      value: stats.lowStock,

      icon: AlertTriangle,

      gradient: "from-orange-400 to-red-500",

      bg: "bg-gradient-to-br from-orange-50 to-red-50",
    },

    {
      title: "Out of Stock",

      value: stats.outOfStock,

      icon: PackageX,

      gradient: "from-rose-500 to-pink-600",

      bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    },

    {
      title: "Inventory Value",

      value: `₹${stats.inventoryValue.toLocaleString()}`,

      icon: IndianRupee,

      gradient: "from-emerald-500 to-green-600",

      bg: "bg-gradient-to-br from-emerald-50 to-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-3xl border border-white/60 ${card.bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            {/* BACKGROUND GLOW */}
            <div
              className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br ${card.gradient} opacity-10 blur-3xl`}
            />

            {/* CONTENT */}
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${card.gradient} text-white shadow-lg`}
              >
                <Icon size={26} />
              </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/50">
              <div
                className={`h-full rounded-full bg-linear-to-r ${card.gradient}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
