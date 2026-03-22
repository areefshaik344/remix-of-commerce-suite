/**
 * Cross-Tab Session Sync
 * Listens for localStorage changes to sync logout/login across browser tabs.
 */
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import { tokenService } from "@/lib/tokenService";
import { useToast } from "@/hooks/use-toast";

const AUTH_STORAGE_KEY = "markethub-auth";

export function useCrossTabSync() {
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearNotifications = useNotificationStore((s) => s.clearAll);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      // Auth store was cleared in another tab (logout)
      if (e.key === AUTH_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const state = parsed?.state;
          if (state && !state.isAuthenticated) {
            tokenService.clearTokens();
            logout();
            clearCart();
            clearNotifications();
            toast({
              title: "Signed out",
              description: "You were logged out in another tab.",
            });
          }
        } catch {
          // ignore parse errors
        }
      }

      // Auth store removed entirely
      if (e.key === AUTH_STORAGE_KEY && e.newValue === null) {
        tokenService.clearTokens();
        logout();
        clearCart();
        clearNotifications();
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [logout, clearCart, clearNotifications, toast]);
}
