/**
 * Notification API — Real backend calls
 */
import httpClient from "@/api/httpClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { NotificationDTO } from "@/types/api";

export const notificationApi = {
  async getNotifications(page = 0, size = 20) {
    const res = await httpClient.get(ENDPOINTS.NOTIFICATIONS.LIST, { params: { page, size } });
    return res.data?.data || res.data;
  },

  async getUnreadCount(): Promise<number> {
    const res = await httpClient.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return res.data?.data ?? res.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await httpClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
  },

  async markAllRead(): Promise<void> {
    await httpClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};
