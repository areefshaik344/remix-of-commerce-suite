import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export interface CreateOrderRequest {
  items: { productId: string; productName: string; quantity: number; price: number; image: string }[];
  shippingAddress: string;
  paymentMethod: string;
  total: number;
}

export const orderApi = {
  async getOrders(userId?: string) {
    const params = userId ? { userId } : {};
    const res = await httpClient.get(ENDPOINTS.ORDERS.LIST, { params });
    return res.data?.data || res.data;
  },

  async getOrderById(orderId: string) {
    const res = await httpClient.get(ENDPOINTS.ORDERS.DETAIL(orderId));
    return res.data?.data || res.data;
  },

  async createOrder(req: CreateOrderRequest, userId: string) {
    const res = await httpClient.post(ENDPOINTS.ORDERS.CREATE, { ...req, userId });
    return res.data?.data || res.data;
  },

  async cancelOrder(orderId: string) {
    const res = await httpClient.patch(ENDPOINTS.ORDERS.CANCEL(orderId));
    return res.data?.data || res.data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const res = await httpClient.patch(ENDPOINTS.ORDERS.DETAIL(orderId), { status });
    return res.data?.data || res.data;
  },

  async requestReturn(orderId: string, reason: string) {
    const res = await httpClient.post(ENDPOINTS.ORDERS.RETURN(orderId), { reason });
    return res.data?.data || res.data;
  },

  async trackOrder(orderId: string) {
    const res = await httpClient.get(ENDPOINTS.ORDERS.TRACK(orderId));
    return res.data?.data || res.data;
  },
};
