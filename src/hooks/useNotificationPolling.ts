import React, { useEffect, useRef, useCallback } from "react";
import { notificationApi } from "@/api/notificationApi";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface UseNotificationPollingOptions {
  /** Polling interval in ms (default 30s) */
  interval?: number;
  /** Whether polling is enabled (default true) */
  enabled?: boolean;
}

/** Request browser notification permission (idempotent) */
async function requestPushPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/** Show a native browser notification */
function showBrowserNotification(title: string, body: string, actionUrl?: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: `markethub-${Date.now()}`,
  });

  if (actionUrl) {
    notification.onclick = () => {
      window.focus();
      window.dispatchEvent(new CustomEvent("notification-navigate", { detail: actionUrl }));
      notification.close();
    };
  } else {
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

/**
 * Polls the backend for new notifications and syncs unread count + items
 * into the Zustand notification store. Shows in-app toasts when the tab
 * is focused, and native browser push notifications when the tab is hidden.
 */
export function useNotificationPolling({
  interval = 30_000,
  enabled = true,
}: UseNotificationPollingOptions = {}) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const isFirstFetchRef = useRef(true);
  const pushPermissionRef = useRef(false);

  // Request push permission on mount
  useEffect(() => {
    if (enabled) {
      requestPushPermission().then((granted) => {
        pushPermissionRef.current = granted;
      });
    }
  }, [enabled]);

  const notifyNewItems = useCallback((newOnes: any[]) => {
    const isTabHidden = document.hidden;

    if (isTabHidden) {
      // Tab is in background → use native browser notifications
      for (const n of newOnes.slice(0, 5)) {
        showBrowserNotification(n.title, n.message, n.actionUrl);
      }
      if (newOnes.length > 5) {
        showBrowserNotification(
          `${newOnes.length - 5} more notifications`,
          "Open MarketHub to view all notifications."
        );
      }
    } else {
      // Tab is focused → use in-app toasts
      for (const n of newOnes.slice(0, 3)) {
        toast({
          title: n.title,
          description: n.message,
          action: n.actionUrl
            ? (React.createElement(ToastAction, {
                altText: "View",
                onClick: () => {
                  window.dispatchEvent(new CustomEvent("notification-navigate", { detail: n.actionUrl }));
                },
              }, "View") as unknown as React.ReactElement<typeof ToastAction>)
            : undefined,
        });
      }
      if (newOnes.length > 3) {
        toast({
          title: `+${newOnes.length - 3} more notifications`,
          description: "Check your notifications for details.",
        });
      }
    }
  }, []);

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

      // Only update if data actually changed
      const currentIds = store.notifications.map(n => n.id).join(",");
      const newIds = mapped.map((n: any) => n.id).join(",");

      if (currentIds !== newIds || store.notifications.length !== mapped.length) {
        if (!isFirstFetchRef.current) {
          const currentIdSet = new Set(store.notifications.map(n => n.id));
          const newOnes = mapped.filter((n: any) => !currentIdSet.has(n.id) && !n.read);
          if (newOnes.length > 0) {
            notifyNewItems(newOnes);
          }
        }
        isFirstFetchRef.current = false;
        useNotificationStore.setState({ notifications: mapped });
      }
    } catch {
      // Silently fail — polling will retry on next tick
    }
  }, [notifyNewItems]);

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
        // Slow down polling when tab is hidden (60s instead of 30s)
        stopPolling();
        timerRef.current = setInterval(syncNotifications, Math.max(interval, 60_000));
      } else {
        syncNotifications(); // immediate fetch on tab focus
        stopPolling();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, interval, startPolling, stopPolling, syncNotifications]);

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

  return {
    refetch: syncNotifications,
    requestPermission: requestPushPermission,
  };
}
