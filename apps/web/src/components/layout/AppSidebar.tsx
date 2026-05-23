import {
  Barcode,
  Boxes,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useAuthStore } from "@/store/auth.store";

export default function AppSidebar() {
  const location = useLocation();

  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);

  const user = useAuthStore((s) => s.user);

  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  const navItems = [
    {
      label: "POS",

      path: "/",

      icon: ShoppingCart,

      roles: ["ADMIN", "CASHIER"],
    },

    {
      label: "Dashboard",

      path: "/dashboard",

      icon: LayoutDashboard,

      roles: ["ADMIN", "ACCOUNTANT"],
    },

    {
      label: "Inventory",

      path: "/inventory",

      icon: Boxes,

      roles: ["ADMIN", "INVENTORY_MANAGER"],
    },

    {
      label: "Documents",

      path: "/documents",

      icon: FileText,

      roles: ["ADMIN", "ACCOUNTANT", "CASHIER"],
    },

    {
      label: "Audit",

      path: "/audit",

      icon: ShieldCheck,

      roles: ["ADMIN"],
    },

    {
      label: "Barcode",

      path: "/barcode",

      icon: Barcode,

      roles: ["ADMIN", "INVENTORY_MANAGER"],
    },
  ];

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* TOP */}
      <div className="flex h-20 items-center border-b px-5">
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white">
            E
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">ERP System</h1>

              <p className="text-xs text-slate-500">Business Suite</p>
            </div>
          )}
        </div>

        {/* COLLAPSE */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-xl p-2 hover:bg-slate-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {navItems
            .filter((item) => item.roles.includes(user?.role || ""))
            .map((item) => {
              const Icon = item.icon;

              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                    active
                      ? "bg-black text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={22} />

                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
        </div>
      </div>

      {/* USER */}
      <div className="border-t p-4">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div>
              <p className="font-medium">{user?.name}</p>

              <p className="text-sm text-slate-500">{user?.role}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="rounded-xl p-3 text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
