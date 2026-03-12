import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, User, users } from "@/data/mock-users";
import { Product } from "@/data/mock-products";

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

// Mock credentials database
const mockCredentials: { email: string; password: string; userId: string }[] = [
  { email: "rahul@example.com", password: "password", userId: "u-1" },
  { email: "priya@vendor.com", password: "password", userId: "u-2" },
  { email: "admin@marketplace.com", password: "password", userId: "u-3" },
  { email: "anita@example.com", password: "password", userId: "u-4" },
  { email: "vikram@example.com", password: "password", userId: "u-5" },
];

// Pending vendor applications
export interface VendorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  category: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

interface AppState {
  // Auth
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  signupWithCredentials: (name: string, email: string, phone: string, password: string) => void;
  registerVendor: (name: string, email: string, phone: string, password: string, storeName: string, category: string, description: string) => void;
  logout: () => void;

  // Vendor applications
  vendorApplications: VendorApplication[];
  approveVendor: (appId: string) => void;
  rejectVendor: (appId: string) => void;

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

  // Compare
  compareList: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentRole: "customer",
      isAuthenticated: false,

      login: (role) => {
        const user = users.find(u => u.role === role) || users[0];
        set({ currentUser: user, currentRole: role, isAuthenticated: true });
      },

      loginWithCredentials: (email, password) => {
        // Phone OTP mock login
        if (password === "phone-otp") {
          const phoneUser = users.find(u => u.role === "customer") || users[0];
          set({ currentUser: phoneUser, currentRole: "customer", isAuthenticated: true });
          return true;
        }
        const cred = mockCredentials.find(c => c.email === email && c.password === password);
        if (!cred) return false;
        const user = users.find(u => u.id === cred.userId);
        if (!user) return false;
        set({ currentUser: user, currentRole: user.role, isAuthenticated: true });
        return true;
      },

      signupWithCredentials: (name, email, phone, _password) => {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          email,
          avatar: "",
          role: "customer",
          phone: `+91 ${phone}`,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        // Add to mock credentials
        mockCredentials.push({ email, password: _password, userId: newUser.id });
        users.push(newUser);
        set({ currentUser: newUser, currentRole: "customer", isAuthenticated: true });
      },

      registerVendor: (name, email, phone, _password, storeName, category, description) => {
        const app: VendorApplication = {
          id: `va-${Date.now()}`,
          name, email, phone, storeName, category, description,
          status: "pending",
          appliedDate: new Date().toISOString().split("T")[0],
        };
        // Create user account as customer (will be upgraded on approval)
        const newUser: User = {
          id: `u-${Date.now()}`,
          name, email, avatar: "", role: "customer",
          phone: `+91 ${phone}`,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        mockCredentials.push({ email, password: _password, userId: newUser.id });
        users.push(newUser);
        set(state => ({
          vendorApplications: [...state.vendorApplications, app],
        }));
      },

      logout: () => set({ currentUser: null, isAuthenticated: false, currentRole: "customer" }),

      vendorApplications: [
        { id: "va-1", name: "Suresh Kumar", email: "suresh@example.com", phone: "9876543210", storeName: "GadgetPro", category: "electronics", description: "Latest gadgets and accessories", status: "pending", appliedDate: "2025-02-20" },
        { id: "va-2", name: "Meena Devi", email: "meena@example.com", phone: "8765432109", storeName: "FashionFiesta", category: "fashion", description: "Trendy women's clothing", status: "pending", appliedDate: "2025-02-25" },
      ],

      approveVendor: (appId) => {
        set(state => ({
          vendorApplications: state.vendorApplications.map(a =>
            a.id === appId ? { ...a, status: "approved" as const } : a
          ),
        }));
      },

      rejectVendor: (appId) => {
        set(state => ({
          vendorApplications: state.vendorApplications.map(a =>
            a.id === appId ? { ...a, status: "rejected" as const } : a
          ),
        }));
      },

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

      compareList: [],
      addToCompare: (productId) => {
        const { compareList } = get();
        if (compareList.length >= 4 || compareList.includes(productId)) return;
        set({ compareList: [...compareList, productId] });
      },
      removeFromCompare: (productId) => set({ compareList: get().compareList.filter(id => id !== productId) }),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (productId) => get().compareList.includes(productId),

      recentlyViewed: [],
      addToRecentlyViewed: (productId) => {
        const { recentlyViewed } = get();
        const updated = [productId, ...recentlyViewed.filter(id => id !== productId)].slice(0, 12);
        set({ recentlyViewed: updated });
      },

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "markethub-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
        compareList: state.compareList,
        recentlyViewed: state.recentlyViewed,
        vendorApplications: state.vendorApplications,
      }),
    }
  )
);
