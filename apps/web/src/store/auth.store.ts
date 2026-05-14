import { create } from "zustand";

import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;

  token: string | null;

  setAuth: (
    user: User,
    token: string
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: localStorage.getItem(
      "user"
    )
      ? JSON.parse(
          localStorage.getItem(
            "user"
          ) as string
        )
      : null,

    token:
      localStorage.getItem(
        "token"
      ),

    setAuth: (
      user,
      token
    ) => {
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      set({
        user,
        token,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      set({
        user: null,

        token: null,
      });
    },
  }));