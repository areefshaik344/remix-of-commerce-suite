import { simulateDelay } from "./apiClient";
import type { Notification } from "@/store/notificationStore";

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

function respond<T>(data: T, message = "Success"): StandardResponse<T> {
  return { success: true, data, message, timestamp: new Date().toISOString() };
}

// Mock notification templates
const mockNotifications: Omit<Notification, "id" | "createdAt">[] = [
  { type: "order", title: "Order Shipped!", message: "Your order ORD-10002 has been shipped and is on its way.", read: false, actionUrl: "/orders/ORD-10002" },
  { type: "promo", title: "Flash Sale! 50% Off Electronics", message: "Don't miss our biggest sale of the season. Limited time only!", read: false, actionUrl: "/products?category=electronics" },
  { type: "system", title: "Welcome to MarketHub!", message: "Start exploring thousands of products from verified sellers.", read: true },
];

export const notificationApi = {
  async getNotifications(): Promise<StandardResponse<Notification[]>> {
    await simulateDelay(200);
    const notifications: Notification[] = mockNotifications.map((n, i) => ({
      ...n,
      id: `notif-${i + 1}`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    }));
    return respond(notifications);
  },

  async markAsRead(notificationId: string): Promise<StandardResponse<{ id: string }>> {
    await simulateDelay(100);
    return respond({ id: notificationId }, "Marked as read");
  },

  async markAllRead(): Promise<StandardResponse<null>> {
    await simulateDelay(100);
    return respond(null, "All notifications marked as read");
  },
};
