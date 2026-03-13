import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/mock-products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface SavedItem {
  product: Product;
  savedAt: number;
}

interface CartState {
  cart: CartItem[];
  savedForLater: SavedItem[];

  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Save for later
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      savedForLater: [],

      addToCart: (product, quantity = 1, variants = {}) => {
        const { cart } = get();
        const existing = cart.find(i => i.product.id === product.id);
        if (existing) {
          set({ cart: cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ cart: [...cart, { product, quantity, selectedVariants: variants }] });
        }
      },

      removeFromCart: (productId) => set({ cart: get().cart.filter(i => i.product.id !== productId) }),

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeFromCart(productId); return; }
        set({ cart: get().cart.map(i => i.product.id === productId ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      saveForLater: (productId) => {
        const { cart, savedForLater } = get();
        const item = cart.find(i => i.product.id === productId);
        if (!item) return;
        set({
          cart: cart.filter(i => i.product.id !== productId),
          savedForLater: [...savedForLater, { product: item.product, savedAt: Date.now() }],
        });
      },

      moveToCart: (productId) => {
        const { savedForLater } = get();
        const item = savedForLater.find(i => i.product.id === productId);
        if (!item) return;
        get().addToCart(item.product);
        set({ savedForLater: savedForLater.filter(i => i.product.id !== productId) });
      },

      removeSaved: (productId) => set({
        savedForLater: get().savedForLater.filter(i => i.product.id !== productId),
      }),
    }),
    {
      name: "markethub-cart",
      partialize: (state) => ({
        cart: state.cart,
        savedForLater: state.savedForLater,
      }),
    }
  )
);
