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

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth.store";

export default function AppSidebar() {
  const location = useLocation();

  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);

  const user = useAuthStore((s) => s.user);

  // PERSIST SIDEBAR STATE
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");

    return saved === "true";
  });

  // SAVE STATE
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

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
      className={`group sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* TOP */}
      <div className="flex h-20  items-center border-b border-slate-200 px-4">
        <div className="flex items-center gap-3">
          {/* LOGO / EXPAND */}
          <button
            onClick={() => collapsed && setCollapsed(false)}
            className="group/logo relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black text-white transition-all duration-300 hover:bg-slate-800"
          >
            {/* DEFAULT LOGO */}
            <span
              className={`absolute text-lg font-bold transition-all duration-200 ${
                collapsed
                  ? "opacity-100 group-hover/logo:opacity-0"
                  : "opacity-100"
              }`}
            >
              NK
            </span>

            {/* EXPAND ICON */}
            {collapsed && (
              <ChevronRight
                size={20}
                className="absolute opacity-0 transition-all duration-200 group-hover/logo:opacity-100"
              />
            )}
          </button>

          {/* TITLE */}
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-slate-900">
                NK Poduval & CO
              </h1>
            </div>
          )}
        </div>

        {/* COLLAPSE BUTTON */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto rounded-xl p-2 transition hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
          </button>
        )}
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
                  className={`group/item flex items-center rounded-2xl transition-all duration-200 ${
                    collapsed ? "justify-center px-0 py-4" : "gap-4 px-4 py-3"
                  } ${
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
      <div className="border-t border-slate-200 p-4">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">
                {user?.name}
              </p>

              <p className="truncate text-sm text-slate-500">{user?.role}</p>
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
