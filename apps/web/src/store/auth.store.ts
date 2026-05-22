import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;

  token: string | null;

  hydrated: boolean;

  setHydrated: (state: boolean) => void;

  setAuth: (user: User, token: string) => void;

  setUser: (user: User) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      token: null,

      hydrated: false,

      setHydrated: (state) =>
        set({
          hydrated: state,
        }),

      setAuth: (user, token) =>
        set({
          user,
          token,
        }),

      setUser: (user) =>
        set((state) => ({
          user,
          token: state.token,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
