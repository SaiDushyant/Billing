import { useState } from "react";

import logo from "@/assets/image.png";

import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "@/lib/api";

import { useAuthStore } from "@/store/auth.store";

import type { AuthResponse } from "@/types/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your username or email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Login failed";
      toast.error(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {/* Dynamic styles for micro-animations and autofill bg fix */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #1e293b !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        @keyframes float-svg {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-svg {
          animation: float-svg 6s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Dotted Grid Decoration Top-Right */}
        <div className="absolute top-10 right-10 opacity-30 grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          ))}
        </div>

        {/* Dotted Grid Decoration Bottom-Left */}
        <div className="absolute bottom-10 left-10 opacity-30 grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          ))}
        </div>

        {/* Elegant Mockup Background Curve */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-0 opacity-40">
          <svg
            viewBox="0 0 1440 220"
            className="relative block w-full h-45 text-blue-100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C320,200 640,160 960,100 C1280,40 1380,80 1440,100 L1440,220 L0,220 Z"
              fill="currentColor"
              opacity="0.6"
            />
            <path
              d="M0,150 C400,220 800,140 1200,160 L1440,130 L1440,220 L0,220 Z"
              fill="currentColor"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 relative">
        {/* Left Column: Centered Branding & Unified Vector Illustration */}
        <div className="md:col-span-6 flex flex-col items-center text-center px-4">
          {/* Logo Group */}
          <div className="mb-2 flex flex-col items-center gap-4">
            <img
              src={logo}
              alt="NK Poduval & Co"
              className="h-60 w-60 rounded-2xl object-cover shadow-md"
            />

            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-3xl">
                NK Poduval & Co
              </h1>
            </div>
          </div>
        </div>

        {/* Right Column: The Login Card */}
        <div className="md:col-span-6 flex justify-center md:justify-end px-2">
          <div className="bg-white px-6 py-8 md:p-10 rounded-3xl w-full max-w-115shadow-[0_15px_40px_rgba(59,130,246,0.06)] border border-slate-100 flex flex-col relative z-20">
            {/* Padlock Icon Bubble */}
            <div className="w-16 h-16 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
                Welcome Back!
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Login to access your ERP dashboard
              </p>
            </div>

            {/* The Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Username Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-bold tracking-wide">
                  Username
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <User className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-200 outline-none text-slate-800 placeholder-slate-400 font-medium text-sm focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-bold tracking-wide">
                  Password
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <Lock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-200 outline-none text-slate-800 placeholder-slate-400 font-medium text-sm focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs md:text-sm mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-md border border-slate-200 bg-white transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-slate-300 flex items-center justify-center text-white">
                      <svg
                        className="w-3.5 h-3.5 transform scale-0 peer-checked:scale-100 transition-transform duration-150"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-slate-700 font-semibold transition-colors duration-200">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200"
                  onClick={() =>
                    toast.info("Password reset feature coming soon!")
                  }
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-blue-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 stroke-[2.5]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="text-center mt-7 text-slate-500 text-sm font-semibold">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors duration-200 ml-1"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-semibold z-10 pointer-events-none">
        © 2026 ERP Billing. All rights reserved.
      </div>
    </div>
  );
}
