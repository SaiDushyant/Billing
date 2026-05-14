import { Navigate } from "react-router-dom";

import type { ReactNode } from "react";

import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
