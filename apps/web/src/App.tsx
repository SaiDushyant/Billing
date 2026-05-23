import { Outlet, Route, Routes } from "react-router-dom";

import AuditPage from "./pages/AuditPage";
import BarcodePage from "./pages/BarcodePage";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import POSPage from "./pages/POSPage";
import SignupPage from "./pages/SignupPage";

import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "sonner";
import AppSidebar from "./components/layout/AppSidebar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <AppSidebar />

      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<POSPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/inventory" element={<InventoryPage />} />

          <Route path="/documents" element={<DocumentsPage />} />

          <Route path="/audit" element={<AuditPage />} />

          <Route path="/barcode" element={<BarcodePage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
