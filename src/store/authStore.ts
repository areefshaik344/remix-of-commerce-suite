import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole, User } from "@/data/mock-users";
import { mockUsers, mockCredentials } from "@/mocks";

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

  login: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  signupWithCredentials: (name: string, email: string, phone: string, password: string) => void;
  registerVendor: (name: string, email: string, phone: string, password: string, storeName: string, category: string, description: string) => void;
  logout: () => void;
  approveVendor: (appId: string) => void;
  rejectVendor: (appId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      currentRole: "customer",
      isAuthenticated: false,
      vendorApplications: [
        { id: "va-1", name: "Suresh Kumar", email: "suresh@example.com", phone: "9876543210", storeName: "GadgetPro", category: "electronics", description: "Latest gadgets and accessories", status: "pending", appliedDate: "2025-02-20" },
        { id: "va-2", name: "Meena Devi", email: "meena@example.com", phone: "8765432109", storeName: "FashionFiesta", category: "fashion", description: "Trendy women's clothing", status: "pending", appliedDate: "2025-02-25" },
      ],

      login: (role) => {
        const user = mockUsers.find(u => u.role === role) || mockUsers[0];
        set({ currentUser: user, currentRole: role, isAuthenticated: true });
      },

      loginWithCredentials: (email, password) => {
        if (password === "phone-otp") {
          const phoneUser = mockUsers.find(u => u.role === "customer") || mockUsers[0];
          set({ currentUser: phoneUser, currentRole: "customer", isAuthenticated: true });
          return true;
        }
        const cred = mockCredentials.find(c => c.email === email && c.password === password);
        if (!cred) return false;
        const user = mockUsers.find(u => u.id === cred.userId);
        if (!user) return false;
        set({ currentUser: user, currentRole: user.role, isAuthenticated: true });
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
        set({ currentUser: newUser, currentRole: "customer", isAuthenticated: true });
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

      logout: () => set({ currentUser: null, isAuthenticated: false, currentRole: "customer" }),

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
      }),
    }
  )
);
