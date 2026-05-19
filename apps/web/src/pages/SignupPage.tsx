import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

import { useAuthStore } from "@/store/auth.store";

import type { AuthResponse } from "@/types/auth";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleSignup() {
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        name,
        email,
        password,
      });

      const { user, token } = response.data;

      setAuth(user, token);

      navigate("/");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string | { message: string }[];
          };
        };
      };

      const backendMessage = axiosError.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        toast.error(backendMessage.map((err) => err.message).join(", "));
      } else {
        toast.error(backendMessage || "Signup failed");
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow">
        <h1 className="text-3xl font-bold mb-6">ERP Signup</h1>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={handleSignup}>
            Signup
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
