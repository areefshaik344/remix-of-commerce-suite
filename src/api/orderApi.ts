import { mockSuccess, simulateDelay, type ApiResponse } from "./apiClient";
import { mockOrders } from "@/mocks";
import type { Order } from "@/data/mock-orders";

export interface CreateOrderRequest {
  items: { productId: string; productName: string; quantity: number; price: number; image: string }[];
  shippingAddress: string;
  paymentMethod: string;
  total: number;
}

export const orderApi = {
  async getOrders(userId?: string): Promise<ApiResponse<Order[]>> {
    await simulateDelay(300);
    const filtered = userId ? mockOrders.filter(o => o.userId === userId) : mockOrders;
    return mockSuccess(filtered);
  },

  async getOrderById(orderId: string): Promise<ApiResponse<Order | null>> {
    await simulateDelay(200);
    return mockSuccess(mockOrders.find(o => o.id === orderId) || null);
  },

  async createOrder(req: CreateOrderRequest, userId: string): Promise<ApiResponse<Order>> {
    await simulateDelay(800);
    const order: Order = {
      id: `ORD-${10000 + mockOrders.length + 1}`,
      userId,
      vendorId: "v-1",
      items: req.items,
      total: req.total,
      status: "pending",
      paymentMethod: req.paymentMethod,
      shippingAddress: req.shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrders.push(order);
    return mockSuccess(order, "Order placed successfully");
  },

  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    await simulateDelay(400);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error("Order not found");
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    return mockSuccess(order, "Order cancelled");
  },

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<ApiResponse<Order>> {
    await simulateDelay(300);
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return mockSuccess(order, "Order updated");
  },

  async requestReturn(orderId: string, reason: string): Promise<ApiResponse<{ requestId: string }>> {
    await simulateDelay(500);
    return mockSuccess({ requestId: `RET-${Date.now()}` }, "Return request submitted");
  },

  async generateInvoice(orderId: string): Promise<ApiResponse<{ url: string }>> {
    await simulateDelay(300);
    return mockSuccess({ url: `/invoices/${orderId}.pdf` }, "Invoice generated");
  },
};
