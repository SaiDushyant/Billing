import type { ReactNode } from "react";

interface Props {
  children: ReactNode;

  title: string;

  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f5f7ff]">
      {/* BACKGROUND BLOBS */}
      <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-blue-300 opacity-60 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-indigo-300 opacity-60 blur-3xl" />

      {/* LEFT SIDE */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <div className="relative z-10 flex w-full flex-col justify-center px-20">
          {/* LOGO */}
          <div className="mb-10">
            <div className="flex items-center gap-5">
              {/* LOGO BOX */}
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 text-4xl font-black text-white shadow-2xl shadow-blue-200">
                E
              </div>

              <div>
                <h1 className="text-6xl font-black tracking-tight text-slate-900">
                  ERP{" "}
                  <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    BILLING
                  </span>
                </h1>

                <div className="mt-3 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
              </div>
            </div>

            <p className="mt-8 max-w-xl text-2xl leading-relaxed text-slate-500">
              Smart Billing, Inventory Management and Analytics — designed for
              modern businesses.
            </p>
          </div>

          {/* DASHBOARD MOCKUP */}
          <div className="relative mt-10">
            <div className="relative h-85 w-162.5 overflow-hidden rounded-[36px] border border-white/50 bg-white/70 shadow-2xl backdrop-blur-2xl">
              {/* TOP BAR */}
              <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />

                  <div className="h-3 w-3 rounded-full bg-yellow-400" />

                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
                  ERP Dashboard
                </div>
              </div>

              {/* CONTENT */}
              <div className="grid grid-cols-3 gap-4 p-6">
                {/* STATS */}
                <div className="rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg">
                  <p className="text-sm opacity-80">Revenue</p>

                  <h2 className="mt-3 text-3xl font-black">₹24K</h2>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 p-4 text-white shadow-lg">
                  <p className="text-sm opacity-80">Orders</p>

                  <h2 className="mt-3 text-3xl font-black">128</h2>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 p-4 text-white shadow-lg">
                  <p className="text-sm opacity-80">Customers</p>

                  <h2 className="mt-3 text-3xl font-black">86</h2>
                </div>

                {/* CHART */}
                <div className="col-span-2 rounded-3xl bg-slate-50 p-5">
                  <div className="flex h-full items-end gap-3">
                    <div className="h-20 w-10 rounded-t-xl bg-blue-500" />

                    <div className="h-32 w-10 rounded-t-xl bg-indigo-500" />

                    <div className="h-24 w-10 rounded-t-xl bg-cyan-500" />

                    <div className="h-40 w-10 rounded-t-xl bg-blue-600" />

                    <div className="h-28 w-10 rounded-t-xl bg-indigo-400" />
                  </div>
                </div>

                {/* SIDE PANEL */}
                <div className="space-y-3 rounded-3xl bg-blue-50 p-4">
                  <div className="h-12 rounded-2xl bg-white shadow-sm" />

                  <div className="h-12 rounded-2xl bg-white shadow-sm" />

                  <div className="h-12 rounded-2xl bg-white shadow-sm" />

                  <div className="h-12 rounded-2xl bg-white shadow-sm" />
                </div>
              </div>
            </div>

            {/* FLOATING CARD */}
            <div className="absolute -right-6 top-10 rounded-3xl border border-white/50 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-sm text-slate-500">Today Sales</p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                ₹12,450
              </h2>

              <div className="mt-2 text-sm font-medium text-emerald-600">
                ↑ 18.2% Growth
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[32px] border border-white/40 bg-white/80 p-10 shadow-2xl backdrop-blur-xl">
          {/* LOCK ICON */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white">
              🔒
            </div>
          </div>

          {/* TITLE */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-slate-900">{title}</h1>

            <p className="mt-3 text-slate-500">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
