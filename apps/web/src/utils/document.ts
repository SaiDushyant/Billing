import {
  Ban,
  FileClock,
  FileText,
  Receipt,
  RotateCcw,
  ScrollText,
} from "lucide-react";

export function getDocumentIcon(type: string) {
  switch (type) {
    case "INVOICE":
      return FileText;

    case "BILL":
      return Receipt;

    case "QUOTATION":
      return ScrollText;

    case "DRAFT":
      return FileClock;

    case "RETURNED":
      return RotateCcw;

    default:
      return Ban;
  }
}

export function getDocumentColor(type: string) {
  switch (type) {
    case "INVOICE":
      return {
        bg: "bg-orange-100",
        text: "text-orange-600",
      };

    case "BILL":
      return {
        bg: "bg-purple-100",
        text: "text-purple-600",
      };

    case "QUOTATION":
      return {
        bg: "bg-green-100",
        text: "text-green-600",
      };

    case "DRAFT":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
      };

    case "RETURNED":
      return {
        bg: "bg-pink-100",
        text: "text-pink-600",
      };

    default:
      return {
        bg: "bg-red-100",
        text: "text-red-600",
      };
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-600";

    case "RETURNED":
      return "bg-pink-100 text-pink-600";

    case "CANCELLED":
      return "bg-red-100 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}
