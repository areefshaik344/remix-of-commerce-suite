import { create } from "zustand";
import { UserRole, User, users } from "@/data/mock-users";
import { Product } from "@/data/mock-products";

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

interface AppState {
  // Auth
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentRole: "customer",
  isAuthenticated: false,
  login: (role) => {
    const user = users.find(u => u.role === role) || users[0];
    set({ currentUser: user, currentRole: role, isAuthenticated: true });
  },
  logout: () => set({ currentUser: null, isAuthenticated: false, currentRole: "customer" }),

  cart: [],
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

  wishlist: [],
  toggleWishlist: (productId) => {
    const { wishlist } = get();
    set({ wishlist: wishlist.includes(productId) ? wishlist.filter(id => id !== productId) : [...wishlist, productId] });
  },
  isInWishlist: (productId) => get().wishlist.includes(productId),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
