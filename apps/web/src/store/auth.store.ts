import { create } from "zustand";

import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;

  token: string | null;

  setAuth: (user: User, token: string) => void;

  setUser: (user: User | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  token: localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("token", token);

    set({
      user,
      token,
    });
  },

  setUser: (user) => {
    set({
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,

      token: null,
    });
  },
}));
