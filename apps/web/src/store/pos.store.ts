import { create } from "zustand";

export interface CartItem {
  variantId: string;

  displayName: string;

  quantity: number;

  sellingPrice: number;

  gstRate: number;
}

interface POSStore {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (variantId: string) => void;

  clearCart: () => void;
}

export const usePOSStore = create<POSStore>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.variantId === item.variantId);

      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.variantId === item.variantId
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                }
              : i,
          ),
        };
      }

      return {
        cart: [...state.cart, item],
      };
    }),

  removeFromCart: (variantId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.variantId !== variantId),
    })),

  clearCart: () =>
    set({
      cart: [],
    }),
}));
