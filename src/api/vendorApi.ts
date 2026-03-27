import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const vendorApi = {
  async getVendorProfile() {
    const res = await httpClient.get(ENDPOINTS.VENDOR.PROFILE);
    return res.data?.data || res.data;
  },

  async getVendorProducts() {
    const res = await httpClient.get(ENDPOINTS.VENDOR.PRODUCTS);
    return res.data?.data || res.data;
  },

  async getVendorOrders() {
    const res = await httpClient.get(ENDPOINTS.VENDOR.ORDERS);
    return res.data?.data || res.data;
  },

  async getVendorBySlug(slug: string) {
    const res = await httpClient.get(ENDPOINTS.VENDOR.STORE(slug));
    return res.data?.data || res.data;
  },

  async updateVendorProfile(data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.VENDOR.PROFILE, data);
    return res.data?.data || res.data;
  },

  async createProduct(product: Record<string, unknown>) {
    const res = await httpClient.post(ENDPOINTS.VENDOR.PRODUCTS, product);
    return res.data?.data || res.data;
  },

  async updateProduct(productId: string, data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.VENDOR.PRODUCT_DETAIL(productId), data);
    return res.data?.data || res.data;
  },

  async deleteProduct(productId: string) {
    const res = await httpClient.delete(ENDPOINTS.VENDOR.PRODUCT_DETAIL(productId));
    return res.data?.data || res.data;
  },

  async getVendorAnalytics() {
    const res = await httpClient.get(ENDPOINTS.VENDOR.ANALYTICS);
    return res.data?.data || res.data;
  },

  async getVendorFinancials() {
    const res = await httpClient.get(ENDPOINTS.VENDOR.FINANCIALS);
    return res.data?.data || res.data;
  },

  async getVendorCoupons() {
    const res = await httpClient.get(ENDPOINTS.VENDOR.COUPONS);
    return res.data?.data || res.data;
  },

  async getVendorStoreProducts(vendorId: string) {
    const res = await httpClient.get(ENDPOINTS.VENDOR.STORE_PRODUCTS(vendorId));
    return res.data?.data || res.data;
  },

  async getAllVendors() {
    const res = await httpClient.get(ENDPOINTS.ADMIN.VENDORS);
    return res.data?.data || res.data;
  },
};
