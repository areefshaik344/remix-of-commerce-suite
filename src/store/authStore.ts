import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { UserRole, User } from "@/data/mock-users";
import { mockUsers, mockCredentials } from "@/mocks";
import { tokenService, type TokenPair } from "@/lib/tokenService";

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
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  vendorApplications: VendorApplication[];
  tokenExpiresAt: number | null;
  refreshExpiresAt: number | null;
  isRefreshing: boolean;
  lastActivity: number;

  // Auth actions
  login: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  signupWithCredentials: (name: string, email: string, phone: string, password: string) => void;
  registerVendor: (name: string, email: string, phone: string, password: string, storeName: string, category: string, description: string) => void;
  logout: () => void;

  // Token management
  setTokens: (pair: TokenPair) => void;
  refreshSession: () => Promise<boolean>;
  checkSession: () => boolean;

  // Vendor approval
  approveVendor: (appId: string) => void;
  rejectVendor: (appId: string) => void;
}

function authenticateUser(user: User, set: (partial: Partial<AuthState>) => void) {
  const tokens = tokenService.generateTokens(user);
  tokenService.persistTokens(tokens);
  set({
    currentUser: user,
    currentRole: user.role,
    isAuthenticated: true,
    tokenExpiresAt: tokens.expiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt,
    lastActivity: Date.now(),
  });
}

function clearAuth(set: (partial: Partial<AuthState>) => void) {
  tokenService.clearTokens();
  set({
    currentUser: null,
    isAuthenticated: false,
    currentRole: "customer",
    tokenExpiresAt: null,
    refreshExpiresAt: null,
    lastActivity: 0,
  });
}

export const useAuthStore = create<AuthState>()(
  devtools(persist(
    (set, get) => ({
      currentUser: null,
      currentRole: "customer",
      isAuthenticated: false,
      vendorApplications: [
        { id: "va-1", name: "Suresh Kumar", email: "suresh@example.com", phone: "9876543210", storeName: "GadgetPro", category: "electronics", description: "Latest gadgets and accessories", status: "pending", appliedDate: "2025-02-20" },
        { id: "va-2", name: "Meena Devi", email: "meena@example.com", phone: "8765432109", storeName: "FashionFiesta", category: "fashion", description: "Trendy women's clothing", status: "pending", appliedDate: "2025-02-25" },
      ],
      tokenExpiresAt: null,
      refreshExpiresAt: null,
      isRefreshing: false,
      lastActivity: 0,

      login: (role) => {
        const user = mockUsers.find(u => u.role === role) || mockUsers[0];
        authenticateUser(user, set);
      },

      loginWithCredentials: (email, password) => {
        // Phone OTP mock
        if (password === "phone-otp") {
          const phoneUser = mockUsers.find(u => u.role === "customer") || mockUsers[0];
          authenticateUser(phoneUser, set);
          return true;
        }
        const cred = mockCredentials.find(c => c.email === email && c.password === password);
        if (!cred) return false;
        const user = mockUsers.find(u => u.id === cred.userId);
        if (!user) return false;
        authenticateUser(user, set);
        return true;
      },

      signupWithCredentials: (name, email, phone, _password) => {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name, email, avatar: "", role: "customer",
          phone: `+91 ${phone}`,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        mockCredentials.push({ email, password: _password, userId: newUser.id });
        mockUsers.push(newUser);
        authenticateUser(newUser, set);
      },

      registerVendor: (name, email, phone, _password, storeName, category, description) => {
        const app: VendorApplication = {
          id: `va-${Date.now()}`,
          name, email, phone, storeName, category, description,
          status: "pending",
          appliedDate: new Date().toISOString().split("T")[0],
        };
        const newUser: User = {
          id: `u-${Date.now()}`,
          name, email, avatar: "", role: "customer",
          phone: `+91 ${phone}`,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        mockCredentials.push({ email, password: _password, userId: newUser.id });
        mockUsers.push(newUser);
        set(state => ({
          vendorApplications: [...state.vendorApplications, app],
        }));
      },

      logout: () => clearAuth(set),

      setTokens: (pair) => {
        tokenService.persistTokens(pair);
        set({
          tokenExpiresAt: pair.expiresAt,
          refreshExpiresAt: pair.refreshExpiresAt,
          lastActivity: Date.now(),
        });
      },

      refreshSession: async () => {
        const { currentUser, isRefreshing } = get();
        if (isRefreshing || !currentUser) return false;

        set({ isRefreshing: true });

        const refreshToken = tokenService.getStoredRefreshToken();
        if (!refreshToken) {
          clearAuth(set);
          set({ isRefreshing: false });
          return false;
        }

        const payload = tokenService.validateRefreshToken(refreshToken);
        if (!payload) {
          clearAuth(set);
          set({ isRefreshing: false });
          return false;
        }

        // Simulate refresh delay
        await new Promise(r => setTimeout(r, 200));

        const user = mockUsers.find(u => u.id === payload.sub);
        if (!user) {
          clearAuth(set);
          set({ isRefreshing: false });
          return false;
        }

        const newTokens = tokenService.generateTokens(user);
        tokenService.persistTokens(newTokens);
        set({
          tokenExpiresAt: newTokens.expiresAt,
          refreshExpiresAt: newTokens.refreshExpiresAt,
          lastActivity: Date.now(),
          isRefreshing: false,
        });
        return true;
      },

      checkSession: () => {
        const accessToken = tokenService.getStoredAccessToken();
        if (accessToken && tokenService.validateAccessToken(accessToken)) {
          return true;
        }
        const refreshToken = tokenService.getStoredRefreshToken();
        if (refreshToken && tokenService.validateRefreshToken(refreshToken)) {
          return true; // session can be refreshed
        }
        // Session fully expired
        if (get().isAuthenticated) {
          clearAuth(set);
        }
        return false;
      },

      approveVendor: (appId) => set(state => ({
        vendorApplications: state.vendorApplications.map(a => a.id === appId ? { ...a, status: "approved" as const } : a),
      })),

      rejectVendor: (appId) => set(state => ({
        vendorApplications: state.vendorApplications.map(a => a.id === appId ? { ...a, status: "rejected" as const } : a),
      })),
    }),
    {
      name: "markethub-auth",
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        isAuthenticated: state.isAuthenticated,
        vendorApplications: state.vendorApplications,
        tokenExpiresAt: state.tokenExpiresAt,
        refreshExpiresAt: state.refreshExpiresAt,
        lastActivity: state.lastActivity,
      }),
    }
  ), { name: "AuthStore" })
);
