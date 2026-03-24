/**
 * App-level auth initialization.
 * On mount, attempts to refresh the session via httpOnly cookie.
 * If successful, sets accessToken + user in Zustand.
 * If not, clears auth state silently.
 */
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/authApi";

export function useAuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized) return;

    let cancelled = false;

    const init = async () => {
      try {
        const res = await authApi.refresh();
        if (!cancelled && res.accessToken && res.user) {
          setAuth(res.accessToken, res.user as any);
        }
      } catch {
        if (!cancelled) {
          clearAuth();
        }
      } finally {
        if (!cancelled) {
          setInitialized(true);
        }
      }
    };

    init();
    return () => { cancelled = true; };
  }, [isInitialized, setAuth, clearAuth, setInitialized]);
}
