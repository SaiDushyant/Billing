import { useState } from "react";

import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

import type { AuthResponse } from "@/types/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    setIsLoading(true);
    try {
      setLoading(true);

      const response = await api.post<AuthResponse>("/auth/register", {
        name,
        email,
        password,
      });

      const { user, token } = response.data;
      setAuth(user, token);
      toast.success("Account created successfully!");
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
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] opacity-40">
          <svg
            viewBox="0 0 1440 220"
            className="relative block w-full h-[180px] text-blue-100"
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
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-11 h-11 text-blue-600"
              viewBox="0 0 48 48"
              fill="none"
            >
              {/* Hexagonal Outer Frame */}
              <path
                d="M24 4L40 13.2V31.8L24 41L8 31.8V13.2L24 4Z"
                fill="#2563EB"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* White isometric box inside */}
              <path
                d="M24 14L34 19.5V29.5L24 35L14 29.5V19.5L24 14Z"
                fill="white"
              />
              {/* Isometric lines on the box */}
              <path d="M24 14V35" stroke="#2563EB" strokeWidth="1.5" />
              <path
                d="M14 19.5L24 25L34 19.5"
                stroke="#2563EB"
                strokeWidth="1.5"
              />
            </svg>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center">
              <span className="text-slate-800">ERP</span>
              <span className="text-blue-600 ml-1.5">BILLING</span>
            </h1>
          </div>

          {/* Underline Separator */}
          <div className="w-14 h-[2px] bg-blue-200 rounded-full mb-4" />

          {/* Slogan */}
          <p className="text-slate-500 font-medium text-sm md:text-base tracking-wide max-w-sm mb-6">
            Smart Billing, Simplified Business
          </p>

          {/* Master Vector Graphic (Single Integrated SVG) */}
          <div className="w-full max-w-md hidden md:block animate-float-svg">
            <svg
              className="w-full h-auto drop-shadow-[0_10px_25px_rgba(59,130,246,0.02)]"
              viewBox="0 0 500 330"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Browser Window Backdrop */}
              <rect
                x="130"
                y="60"
                width="240"
                height="175"
                rx="12"
                fill="white"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />

              {/* Browser Top Header */}
              <path
                d="M130.75 60.75 H369.25 Q369.25 60.75 369.25 78 V78 H130.75 Z"
                fill="#F8FAFC"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />

              {/* Browser Address Bar Pill */}
              <rect
                x="185"
                y="66"
                width="130"
                height="8"
                rx="4"
                fill="#EDF2F7"
              />

              {/* Browser Control Buttons */}
              <circle cx="145" cy="70" r="3" fill="#CBD5E1" />
              <circle cx="155" cy="70" r="3" fill="#CBD5E1" />
              <circle cx="165" cy="70" r="3" fill="#CBD5E1" />

              {/* Browser Line Chart Dashed Grid lines */}
              <line
                x1="145"
                y1="120"
                x2="280"
                y2="120"
                stroke="#F1F5F9"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line
                x1="145"
                y1="150"
                x2="280"
                y2="150"
                stroke="#F1F5F9"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line
                x1="145"
                y1="180"
                x2="280"
                y2="180"
                stroke="#F1F5F9"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Chart Line Spline Path with Gradient Area */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Filled Chart Area */}
              <path
                d="M145 190 Q170 180 185 150 T220 170 T255 110 T280 120 V200 H145 Z"
                fill="url(#chartGrad)"
              />

              {/* Spline Stroke Line */}
              <path
                d="M145 190 Q170 180 185 150 T220 170 T255 110 T280 120"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Glowing Line Nodes */}
              <circle
                cx="185"
                cy="150"
                r="3"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="1"
              />
              <circle
                cx="220"
                cy="170"
                r="3"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="1"
              />
              <circle
                cx="255"
                cy="110"
                r="3"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="1"
              />

              {/* Simple Donut Chart inside Browser */}
              <circle
                cx="325"
                cy="115"
                r="18"
                stroke="#F1F5F9"
                strokeWidth="4.5"
                fill="none"
              />
              <circle
                cx="325"
                cy="115"
                r="18"
                stroke="#3B82F6"
                strokeWidth="4.5"
                strokeDasharray="80 115"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 325 115)"
              />
              <text
                x="325"
                y="118"
                textAnchor="middle"
                fill="#475569"
                fontSize="8"
                fontWeight="bold"
              >
                70%
              </text>
              <rect
                x="305"
                y="145"
                width="40"
                height="4"
                rx="2"
                fill="#E2E8F0"
              />
              <rect
                x="315"
                y="153"
                width="20"
                height="4"
                rx="2"
                fill="#3B82F6"
              />

              {/* Simple Tabs inside Browser */}
              <rect
                x="145"
                y="90"
                width="30"
                height="10"
                rx="3"
                fill="#EFF6FF"
              />
              <rect
                x="180"
                y="90"
                width="30"
                height="10"
                rx="3"
                fill="#F1F5F9"
              />

              {/* Flat Outline Calculator Widget (Left) */}
              <rect
                x="50"
                y="180"
                width="45"
                height="60"
                rx="8"
                fill="white"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />
              <rect
                x="56"
                y="186"
                width="33"
                height="10"
                rx="2"
                fill="#F8FAFC"
                stroke="#E2E8F0"
              />
              <circle cx="61" cy="205" r="2" fill="#E2E8F0" />
              <circle cx="69" cy="205" r="2" fill="#E2E8F0" />
              <circle cx="77" cy="205" r="2" fill="#E2E8F0" />
              <circle cx="85" cy="205" r="2" fill="#3B82F6" />
              <circle cx="61" cy="213" r="2" fill="#E2E8F0" />
              <circle cx="69" cy="213" r="2" fill="#E2E8F0" />
              <circle cx="77" cy="213" r="2" fill="#E2E8F0" />
              <circle cx="85" cy="213" r="2" fill="#E2E8F0" />
              <circle cx="61" cy="221" r="2" fill="#E2E8F0" />
              <circle cx="69" cy="221" r="2" fill="#E2E8F0" />
              <circle cx="77" cy="221" r="2" fill="#E2E8F0" />
              <circle cx="85" cy="221" r="2" fill="#E2E8F0" />
              <circle cx="61" cy="229" r="2" fill="#E2E8F0" />
              <circle cx="69" cy="229" r="2" fill="#E2E8F0" />
              <circle cx="77" cy="229" r="2" fill="#E2E8F0" />
              <circle cx="85" cy="229" r="2" fill="#E2E8F0" />

              {/* Flat Outline Invoice Document Widget (Middle-Left) */}
              <rect
                x="75"
                y="125"
                width="70"
                height="90"
                rx="8"
                fill="white"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />
              {/* Invoice lines */}
              <rect
                x="85"
                y="152"
                width="22"
                height="3"
                rx="1.5"
                fill="#E2E8F0"
              />
              <rect
                x="85"
                y="160"
                width="30"
                height="3"
                rx="1.5"
                fill="#E2E8F0"
              />
              <rect
                x="85"
                y="180"
                width="40"
                height="4"
                rx="2"
                fill="#1E293B"
              />
              {/* Rupee Circle Badge */}
              <circle
                cx="95"
                cy="140"
                r="10"
                fill="#EFF6FF"
                stroke="#DBEAFE"
                strokeWidth="1"
              />
              <text
                x="95"
                y="144"
                textAnchor="middle"
                fill="#3B82F6"
                fontSize="12"
                fontWeight="bold"
              >
                ₹
              </text>
              {/* Status Badge */}
              <rect
                x="115"
                y="136"
                width="22"
                height="8"
                rx="4"
                fill="#ECFDF5"
              />
              <text
                x="126"
                y="142"
                textAnchor="middle"
                fill="#10B981"
                fontSize="5"
                fontWeight="bold"
              >
                Paid
              </text>

              {/* Flat Delivery Box Widget (Right) */}
              <rect
                x="360"
                y="170"
                width="70"
                height="55"
                rx="8"
                fill="white"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />
              <rect
                x="368"
                y="178"
                width="18"
                height="18"
                rx="4"
                fill="#FFFBEB"
                stroke="#FEF3C7"
                strokeWidth="1"
              />
              <path
                d="M377 182 L381 184.5 V189.5 L377 192 L373 189.5 V184.5 L377 182 Z"
                fill="#F59E0B"
              />
              <rect
                x="392"
                y="181"
                width="22"
                height="4"
                rx="2"
                fill="#1E293B"
              />
              <rect
                x="392"
                y="189"
                width="14"
                height="3"
                rx="1.5"
                fill="#E2E8F0"
              />
              <circle cx="418" cy="205" r="4.5" fill="#EFF6FF" />
              <path d="M415.5 204.5 H420.5 L420 207 H416 Z" fill="#3B82F6" />
            </svg>
          </div>
        </div>

        {/* Right Column: The Signup Card */}
        <div className="md:col-span-6 flex justify-center md:justify-end px-2">
          <div className="bg-white px-6 py-8 md:p-10 rounded-3xl w-full max-w-[460px] shadow-[0_15px_40px_rgba(59,130,246,0.06)] border border-slate-100 flex flex-col relative z-20">
            {/* User Plus Icon Bubble */}
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
                Create Account
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Get started with your ERP dashboard
              </p>
            </div>

            {/* The Form */}
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {/* Full Name Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-bold tracking-wide">
                  Full Name
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <User className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-200 outline-none text-slate-800 placeholder-slate-400 font-medium text-sm focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Email Address Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-bold tracking-wide">
                  Email Address
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <Mail className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
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

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-blue-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 stroke-[2.2]" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-7 text-slate-500 text-sm font-semibold">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors duration-200 ml-1"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-semibold z-10 pointer-events-none">
        © 2024 ERP Billing. All rights reserved.
      </div>
    </div>
  );
}
