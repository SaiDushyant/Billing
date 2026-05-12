import { useState } from "react";

import POSPage from "./pages/POSPage";

import DashboardPage from "./pages/DashboardPage";

import BarcodePage from "./pages/BarcodePage";

export default function App() {
  const [page, setPage] = useState<"pos" | "dashboard" | "barcode">("pos");

  return (
    <div className="h-screen">
      <div className="h-14 border-b bg-white flex items-center gap-4 px-4">
        <button onClick={() => setPage("pos")}>POS</button>

        <button onClick={() => setPage("dashboard")}>Dashboard</button>

        <button onClick={() => setPage("barcode")}>Barcode</button>
      </div>

      {page === "pos" ? (
        <POSPage />
      ) : page === "dashboard" ? (
        <DashboardPage />
      ) : (
        <BarcodePage />
      )}
    </div>
  );
}
