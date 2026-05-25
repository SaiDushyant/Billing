import {
  CircleDollarSign,
  LogIn,
  LogOut,
  Pencil,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export function getAuditIcon(action: string) {
  switch (action) {
    case "SALE":
      return CircleDollarSign;

    case "UPDATE":
      return Pencil;

    case "DELETE":
      return Trash2;

    case "RETURN":
      return RotateCcw;

    case "LOGIN":
      return LogIn;

    case "LOGOUT":
      return LogOut;

    default:
      return ShieldCheck;
  }
}

export function getAuditColors(action: string) {
  switch (action) {
    case "SALE":
      return {
        border: "border-l-emerald-500",

        bg: "bg-emerald-50",

        text: "text-emerald-600",
      };

    case "UPDATE":
      return {
        border: "border-l-violet-500",

        bg: "bg-violet-50",

        text: "text-violet-600",
      };

    case "DELETE":
    case "CANCEL":
      return {
        border: "border-l-red-500",

        bg: "bg-red-50",

        text: "text-red-500",
      };

    case "RETURN":
      return {
        border: "border-l-orange-500",

        bg: "bg-orange-50",

        text: "text-orange-500",
      };

    case "LOGIN":
      return {
        border: "border-l-blue-500",

        bg: "bg-blue-50",

        text: "text-blue-600",
      };

    default:
      return {
        border: "border-l-slate-400",

        bg: "bg-slate-100",

        text: "text-slate-600",
      };
  }
}

export function getModuleBadgeColor(entityType: string) {
  switch (entityType) {
    case "DOCUMENT":
      return "bg-blue-100 text-blue-700";

    case "INVENTORY":
      return "bg-violet-100 text-violet-700";

    case "PAYMENT":
      return "bg-emerald-100 text-emerald-700";

    case "CUSTOMER":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}
