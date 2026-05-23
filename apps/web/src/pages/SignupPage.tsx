import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Lock, Mail, User } from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

import { useAuthStore } from "@/store/auth.store";

import type { AuthResponse } from "@/types/auth";

import AuthLayout from "@/components/auth/AuthLayout";

export default function SignupPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    try {
      setLoading(true);

      const response = await api.post<AuthResponse>("/auth/register", {
        name,
        email,
        password,
      });

      const { user, token } = response.data;

      setAuth(user, token);

      toast.success("Account created");

      navigate("/");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            message?:
              | string
              | {
                  message: string;
                }[];
          };
        };
      };

      const backendMessage = axiosError.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        toast.error(backendMessage.map((err) => err.message).join(", "));
      } else {
        toast.error(backendMessage || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start managing your business smarter"
    >
      <div className="space-y-6">
        {/* NAME */}
        <div>
          <label className="mb-2 block text-sm font-semibold">Full Name</label>

          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

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
              placeholder="Enter email"
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
              placeholder="Create password"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
