import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import { authApi } from "@/api/authApi";
import { useCallback } from "react";
import type { UserRole } from "@/data/mock-users";

export function useAuth() {
  const store = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const clearNotifications = useNotificationStore((s) => s.clearAll);

  const hasRole = useCallback(
    (role: UserRole) => store.currentRole === role,
    [store.currentRole]
  );

  const isAdmin = store.currentRole === "admin";
  const isVendor = store.currentRole === "vendor";
  const isCustomer = store.currentRole === "customer";

  /** Login via real backend */
  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    store.setAuth(res.accessToken, res.user as any);
    return true;
  }, [store]);

  /** Signup via real backend */
  const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const res = await authApi.signup({ name, email, phone, password });
    store.setAuth(res.accessToken, res.user as any);
    return true;
  }, [store]);

  /** Full logout: API call + clear all state */
  const logout = useCallback(async () => {
    await authApi.logout();
    store.clearAuth();
    clearCart();
    clearNotifications();
  }, [store, clearCart, clearNotifications]);

  return {
    user: store.currentUser,
    role: store.currentRole,
    isAuthenticated: store.isAuthenticated,
    isInitialized: store.isInitialized,
    isAdmin,
    isVendor,
    isCustomer,
    hasRole,
    login,
    signup,
    logout,
    vendorApplications: store.vendorApplications,
    approveVendor: store.approveVendor,
    rejectVendor: store.rejectVendor,
    isRefreshing: store.isRefreshing,
  };
}
