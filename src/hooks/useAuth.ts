import { useAuthStore } from "@/store/authStore";
import { useCallback } from "react";
import type { UserRole } from "@/data/mock-users";

export function useAuth() {
  const store = useAuthStore();

  const hasRole = useCallback(
    (role: UserRole) => store.currentRole === role,
    [store.currentRole]
  );

  const isAdmin = store.currentRole === "admin";
  const isVendor = store.currentRole === "vendor";
  const isCustomer = store.currentRole === "customer";

  return {
    user: store.currentUser,
    role: store.currentRole,
    isAuthenticated: store.isAuthenticated,
    isAdmin,
    isVendor,
    isCustomer,
    hasRole,
    login: store.login,
    loginWithCredentials: store.loginWithCredentials,
    signupWithCredentials: store.signupWithCredentials,
    registerVendor: store.registerVendor,
    logout: store.logout,
    vendorApplications: store.vendorApplications,
    approveVendor: store.approveVendor,
    rejectVendor: store.rejectVendor,
  };
}
