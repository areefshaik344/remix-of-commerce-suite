import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { UserRole, User } from "@/data/mock-users";

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

interface AuthState {
  // Auth
  accessToken: string | null;
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isRefreshing: boolean;

  // Vendor applications (admin feature)
  vendorApplications: VendorApplication[];

  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setAccessToken: (token: string) => void;
  setInitialized: (v: boolean) => void;
  setRefreshing: (v: boolean) => void;

  // Vendor approval (kept for admin panel)
  approveVendor: (appId: string) => void;
  rejectVendor: (appId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(persist(
    (set) => ({
      accessToken: null,
      currentUser: null,
      currentRole: "customer",
      isAuthenticated: false,
      isInitialized: false,
      isRefreshing: false,
      vendorApplications: [],

      setAuth: (token, user) => set({
        accessToken: token,
        currentUser: user,
        currentRole: user.role,
        isAuthenticated: true,
      }),

      clearAuth: () => set({
        accessToken: null,
        currentUser: null,
        currentRole: "customer",
        isAuthenticated: false,
      }),

      setAccessToken: (token) => set({ accessToken: token }),

      setInitialized: (v) => set({ isInitialized: v }),

      setRefreshing: (v) => set({ isRefreshing: v }),

      approveVendor: (appId) => set((state) => ({
        vendorApplications: state.vendorApplications.map((a) =>
          a.id === appId ? { ...a, status: "approved" as const } : a
        ),
      })),

      rejectVendor: (appId) => set((state) => ({
        vendorApplications: state.vendorApplications.map((a) =>
          a.id === appId ? { ...a, status: "rejected" as const } : a
        ),
      })),
    }),
    {
      name: "markethub-auth",
      // ONLY persist user info, NOT the accessToken (memory-only)
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        isAuthenticated: state.isAuthenticated,
        vendorApplications: state.vendorApplications,
      }),
    }
  ), { name: "AuthStore" })
);
