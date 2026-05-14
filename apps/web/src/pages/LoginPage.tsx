import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

import type { AuthResponse } from "@/types/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      setAuth(user, token);

      navigate("/");
    } catch {
      alert("Login failed");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow">
        <h1 className="text-3xl font-bold mb-6">ERP Login</h1>

        <div className="space-y-4">
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

          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
