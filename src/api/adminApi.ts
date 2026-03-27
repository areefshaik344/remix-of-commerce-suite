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


  async getCategories() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.CATEGORIES);
    return res.data?.data || res.data;
  },

  async getCoupons() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.COUPONS);
    return res.data?.data || res.data;
  },

  async createCoupon(data: Record<string, unknown>) {
    const res = await httpClient.post(ENDPOINTS.ADMIN.COUPON_CREATE, data);
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

  async getAnalytics() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.ANALYTICS);
    return res.data?.data || res.data;
  },

  async getReporting() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.REPORTING);
    return res.data?.data || res.data;
  },

  async getOrderById(orderId: string) {
    const res = await httpClient.get(ENDPOINTS.ADMIN.ORDER_DETAIL(orderId));
    return res.data?.data || res.data;
  },

  async getProductById(productId: string) {
    const res = await httpClient.get(ENDPOINTS.ADMIN.PRODUCT_DETAIL(productId));
    return res.data?.data || res.data;
  },

  async refundOrder(orderId: string, amount: number, reason: string) {
    const res = await httpClient.post(ENDPOINTS.ADMIN.ORDER_REFUND(orderId), { amount, reason });
    return res.data?.data || res.data;
  },

  async getAuditLog() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.AUDIT_LOG);
    return res.data?.data || res.data;
  },

  async getVendorApplications() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.VENDOR_APPLICATIONS);
    return res.data?.data || res.data;
  },

  async approveVendorApplication(id: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.VENDOR_APPLICATION_APPROVE(id));
    return res.data?.data || res.data;
  },

  async rejectVendorApplication(id: string) {
    const res = await httpClient.patch(ENDPOINTS.ADMIN.VENDOR_APPLICATION_REJECT(id));
    return res.data?.data || res.data;
  },

  // Settings
  async getSettings() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.SETTINGS);
    return res.data?.data || res.data;
  },

  async updateSettings(data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.ADMIN.SETTINGS, data);
    return res.data?.data || res.data;
  },

  // Banners / CMS
  async getBanners() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.BANNERS);
    return res.data?.data || res.data;
  },

  async getBannerById(id: string) {
    const res = await httpClient.get(ENDPOINTS.ADMIN.BANNER_DETAIL(id));
    return res.data?.data || res.data;
  },

  async createBanner(data: Record<string, unknown>) {
    const res = await httpClient.post(ENDPOINTS.ADMIN.BANNERS, data);
    return res.data?.data || res.data;
  },

  async updateBanner(id: string, data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.ADMIN.BANNER_DETAIL(id), data);
    return res.data?.data || res.data;
  },

  async deleteBanner(id: string) {
    const res = await httpClient.delete(ENDPOINTS.ADMIN.BANNER_DETAIL(id));
    return res.data?.data || res.data;
  },

  async getSections() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.SECTIONS);
    return res.data?.data || res.data;
  },

  async updateSections(data: Record<string, unknown>[]) {
    const res = await httpClient.put(ENDPOINTS.ADMIN.SECTIONS, data);
    return res.data?.data || res.data;
  },

  async getPages() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.PAGES);
    return res.data?.data || res.data;
  },

  async deletePage(id: string) {
    const res = await httpClient.delete(ENDPOINTS.ADMIN.PAGE_DETAIL(id));
    return res.data?.data || res.data;
  },

  // Commission
  async getCommissionRates() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.COMMISSION);
    return res.data?.data || res.data;
  },

  async updateCommissionRates(data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.ADMIN.COMMISSION, data);
    return res.data?.data || res.data;
  },

  async getCommissionOverrides() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.COMMISSION_OVERRIDES);
    return res.data?.data || res.data;
  },

  // Fraud
  async getFraudOrders() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.FRAUD_ORDERS);
    return res.data?.data || res.data;
  },

  async getFraudReviews() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.FRAUD_REVIEWS);
    return res.data?.data || res.data;
  },

  async getFraudReports() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.FRAUD_REPORTS);
    return res.data?.data || res.data;
  },

  async takeFraudAction(id: string, action: string) {
    const res = await httpClient.post(ENDPOINTS.ADMIN.FRAUD_ACTION(id), { action });
    return res.data?.data || res.data;
  },

  // Email Templates
  async getEmailTemplates() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.EMAIL_TEMPLATES);
    return res.data?.data || res.data;
  },

  async updateEmailTemplate(id: string, data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.ADMIN.EMAIL_TEMPLATE_DETAIL(id), data);
    return res.data?.data || res.data;
  },

  // Categories CRUD
  async createCategory(data: Record<string, unknown>) {
    const res = await httpClient.post(ENDPOINTS.ADMIN.CATEGORIES, data);
    return res.data?.data || res.data;
  },

  async updateCategory(id: string, data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.ADMIN.CATEGORY_DETAIL(id), data);
    return res.data?.data || res.data;
  },

  async deleteCategory(id: string) {
    const res = await httpClient.delete(ENDPOINTS.ADMIN.CATEGORY_DETAIL(id));
    return res.data?.data || res.data;
  },
};
