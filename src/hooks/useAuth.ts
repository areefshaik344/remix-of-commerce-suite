import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import { tokenService } from "@/lib/tokenService";
import { useCallback, useEffect, useRef } from "react";
import type { UserRole } from "@/data/mock-users";

const SESSION_CHECK_INTERVAL = 60_000; // 1 minute
const TOKEN_REFRESH_BUFFER   = 2 * 60_000; // refresh 2 min before expiry

export function useAuth() {
  const store = useAuthStore();
  const clearCart = useCartStore(s => s.clearCart);
  const clearNotifications = useNotificationStore(s => s.clearAll);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasRole = useCallback(
    (role: UserRole) => store.currentRole === role,
    [store.currentRole]
  );

  const isAdmin = store.currentRole === "admin";
  const isVendor = store.currentRole === "vendor";
  const isCustomer = store.currentRole === "customer";

  // Full logout: clears tokens, auth state, cart, and notifications
  const logout = useCallback(() => {
    tokenService.clearTokens();
    store.logout();
    clearCart();
    clearNotifications();
  }, [store.logout, clearCart, clearNotifications]);

  // Automatic token refresh & session validation
  useEffect(() => {
    if (!store.isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const checkAndRefresh = async () => {
      const accessToken = tokenService.getStoredAccessToken();

      // If access token is expiring soon, auto-refresh
      if (accessToken && tokenService.isExpiringSoon(accessToken, TOKEN_REFRESH_BUFFER)) {
        await store.refreshSession();
        return;
      }

      // If no access token at all, try refresh
      if (!accessToken) {
        const success = await store.refreshSession();
        if (!success) logout();
        return;
      }

      // Validate access token
      if (!tokenService.validateAccessToken(accessToken)) {
        const success = await store.refreshSession();
        if (!success) logout();
      }
    };

    // Initial check
    checkAndRefresh();

    // Periodic session check
    intervalRef.current = setInterval(checkAndRefresh, SESSION_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [store.isAuthenticated]);

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
    logout,
    vendorApplications: store.vendorApplications,
    approveVendor: store.approveVendor,
    rejectVendor: store.rejectVendor,
    isRefreshing: store.isRefreshing,
    tokenExpiresAt: store.tokenExpiresAt,
    checkSession: store.checkSession,
    refreshSession: store.refreshSession,
  };
}
