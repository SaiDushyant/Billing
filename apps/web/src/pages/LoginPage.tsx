import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Lock, Mail } from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

import { useAuthStore } from "@/store/auth.store";

import type { AuthResponse } from "@/types/auth";

import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      setAuth(user, token);

      toast.success("Login successful");

      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Login to access your ERP dashboard"
    >
      <div className="space-y-6">
        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-semibold">Email</label>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-2 block text-sm font-semibold">Password</label>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
