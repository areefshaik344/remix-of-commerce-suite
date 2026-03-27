import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const adminApi = {
  async getDashboardStats() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.ANALYTICS);
    return res.data?.data || res.data;
  },

  async getUsers() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.USERS);
    return res.data?.data || res.data;
  },

  async getUserById(userId: string) {
    const res = await httpClient.get(ENDPOINTS.ADMIN.USER_DETAIL(userId));
    return res.data?.data || res.data;
  },

  async toggleUserActive(userId: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.USER_TOGGLE(userId));
    return res.data?.data || res.data;
  },

  async getVendors() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.VENDORS);
    return res.data?.data || res.data;
  },

  async getVendorById(vendorId: string) {
    const res = await httpClient.get(ENDPOINTS.ADMIN.VENDOR_DETAIL(vendorId));
    return res.data?.data || res.data;
  },

  async approveVendor(vendorId: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.VENDOR_APPROVE(vendorId));
    return res.data?.data || res.data;
  },

  async rejectVendor(vendorId: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.VENDOR_REJECT(vendorId));
    return res.data?.data || res.data;
  },

  async getAllOrders() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.ORDERS);
    return res.data?.data || res.data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.ORDER_STATUS(orderId), { status });
    return res.data?.data || res.data;
  },

  async getAllProducts() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.PRODUCTS);
    return res.data?.data || res.data;
  },

  async deleteUser(userId: string) {
    const res = await httpClient.delete(ENDPOINTS.ADMIN.USER_DETAIL(userId));
    return res.data?.data || res.data;
  },

  async getAuditLog() {
    const res = await httpClient.get(`${ENDPOINTS.ADMIN.ANALYTICS}/audit-log`);
    return res.data?.data || res.data;
  },

  async getCategories() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.CATEGORIES);
    return res.data?.data || res.data;
  },

  async getCoupons() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.COUPONS);
    return res.data?.data || res.data;
  },

  async toggleCoupon(couponId: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.COUPON_TOGGLE(couponId));
    return res.data?.data || res.data;
  },

  async deleteCoupon(couponId: string) {
    const res = await httpClient.delete(ENDPOINTS.ADMIN.COUPON_DELETE(couponId));
    return res.data?.data || res.data;
  },
};
