import { useEffect, useRef, useCallback } from "react";
import { notificationApi } from "@/api/notificationApi";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "@/hooks/use-toast";

interface UseNotificationPollingOptions {
  /** Polling interval in ms (default 30s) */
  interval?: number;
  /** Whether polling is enabled (default true) */
  enabled?: boolean;
}

/**
 * Polls the backend for new notifications and syncs unread count + items
 * into the Zustand notification store. Automatically pauses when the
 * browser tab is hidden and resumes when visible.
 */
export function useNotificationPolling({
  interval = 30_000,
  enabled = true,
}: UseNotificationPollingOptions = {}) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const isFirstFetchRef = useRef(true);

  const syncNotifications = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      const [notifications, unreadCount] = await Promise.all([
        notificationApi.getNotifications(0, 50),
        notificationApi.getUnreadCount(),
      ]);

      if (!isMountedRef.current) return;

      const store = useNotificationStore.getState();

      // Replace store notifications with fresh server data
      const mapped = (Array.isArray(notifications) ? notifications : []).map((n: any) => ({
        id: n.id,
        type: n.type || "system",
        title: n.title,
        message: n.message || n.body || "",
        timestamp: n.createdAt || n.timestamp || new Date().toISOString(),
        read: n.read ?? false,
        actionUrl: n.actionUrl,
      }));

      // Only update if data actually changed (compare by latest id + count)
      const currentIds = store.notifications.map(n => n.id).join(",");
      const newIds = mapped.map((n: any) => n.id).join(",");

      if (currentIds !== newIds || store.notifications.length !== mapped.length) {
        // Find genuinely new notifications (not in current store)
        if (!isFirstFetchRef.current) {
          const currentIdSet = new Set(store.notifications.map(n => n.id));
          const newOnes = mapped.filter((n: any) => !currentIdSet.has(n.id) && !n.read);
          for (const n of newOnes.slice(0, 3)) {
            toast({
              title: n.title,
              description: n.message,
            });
          }
          if (newOnes.length > 3) {
            toast({
              title: `+${newOnes.length - 3} more notifications`,
              description: "Check your notifications for details.",
            });
          }
        }
        isFirstFetchRef.current = false;
        useNotificationStore.setState({ notifications: mapped });
      }
    } catch {
      // Silently fail — polling will retry on next tick
    }
  }, []);

  const startPolling = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(syncNotifications, interval);
  }, [syncNotifications, interval]);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Visibility-based pause/resume
  useEffect(() => {
    if (!enabled) return;

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        syncNotifications(); // immediate fetch on tab focus
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, startPolling, stopPolling, syncNotifications]);

  // Main effect — initial fetch + start timer
  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      stopPolling();
      return;
    }

    syncNotifications(); // immediate first fetch
    startPolling();

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling, syncNotifications]);

  return { refetch: syncNotifications };
}
