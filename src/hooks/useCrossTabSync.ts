/**
 * Cross-Tab Session Sync
 * Listens for Zustand persist storage changes to sync logout across tabs.
 */
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useToast } from "@/hooks/use-toast";

const AUTH_STORAGE_KEY = "markethub-auth";

export function useCrossTabSync() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearNotifications = useNotificationStore((s) => s.clearAll);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const state = parsed?.state;
          if (state && !state.isAuthenticated) {
            clearAuth();
            clearCart();
            clearNotifications();
            toast({
              title: "Signed out",
              description: "You were logged out in another tab.",
            });
          }
        } catch {
          // ignore
        }
      }

      if (e.key === AUTH_STORAGE_KEY && e.newValue === null) {
        clearAuth();
        clearCart();
        clearNotifications();
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [clearAuth, clearCart, clearNotifications, toast]);
}
