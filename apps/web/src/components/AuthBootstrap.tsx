import { useEffect } from "react";

import type { ReactNode } from "react";

import { useCurrentUser } from "@/features/auth/useCurrentUser";

import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: ReactNode;
}

export default function AuthBootstrap({ children }: Props) {
  const token = useAuthStore((s) => s.token);

  const setUser = useAuthStore((s) => s.setUser);

  const logout = useAuthStore((s) => s.logout);

  const { data, isError } = useCurrentUser();

  useEffect(() => {
    if (data && token) {
      setUser(data);
    }
  }, [data, token, setUser]);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  return children;
}
