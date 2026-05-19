import { Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";

import POSPage from "./pages/POSPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import BarcodePage from "./pages/BarcodePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuditPage from "./pages/AuditPage";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuthStore } from "./store/auth.store";

function Layout() {
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);

  const user = useAuthStore((s) => s.user);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <div className="h-screen">
      <div className="h-14 border-b bg-white flex items-center gap-4 px-4">
        <Link to="/">POS</Link>

        {["ADMIN", "ACCOUNTANT"].includes(user?.role || "") && (
          <Link to="/dashboard">Dashboard</Link>
        )}

        {["ADMIN", "INVENTORY_MANAGER"].includes(user?.role || "") && (
          <Link to="/inventory">Inventory</Link>
        )}

        {user?.role === "ADMIN" && <Link to="/audit">Audit</Link>}

        <Link to="/barcode">Barcode</Link>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default function App() {
  return (
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

        <Route path="/audit" element={<AuditPage />} />

        <Route path="/barcode" element={<BarcodePage />} />
      </Route>
    </Routes>
  );
}
