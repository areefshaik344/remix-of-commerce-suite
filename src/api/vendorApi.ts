import { mockSuccess, simulateDelay, type ApiResponse } from "./apiClient";
import { mockProducts } from "@/mocks";
import { mockVendors } from "@/mocks";
import { mockOrders } from "@/mocks";
import type { Product } from "@/data/mock-products";
import type { Vendor } from "@/data/mock-users";
import type { Order } from "@/data/mock-orders";

export const vendorApi = {
  async getVendorProfile(vendorId: string): Promise<ApiResponse<Vendor | null>> {
    await simulateDelay(200);
    return mockSuccess(mockVendors.find(v => v.id === vendorId) || null);
  },

  async getVendorProducts(vendorId: string): Promise<ApiResponse<Product[]>> {
    await simulateDelay(200);
    return mockSuccess(mockProducts.filter(p => p.vendorId === vendorId));
  },

  async getVendorOrders(vendorId: string): Promise<ApiResponse<Order[]>> {
    await simulateDelay(300);
    return mockSuccess(mockOrders.filter(o => o.vendorId === vendorId));
  },

  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor | null>> {
    await simulateDelay(200);
    const vendor = mockVendors.find(v => v.storeName.toLowerCase().replace(/\s+/g, "-") === slug);
    return mockSuccess(vendor || null);
  },

  async updateVendorProfile(vendorId: string, data: Partial<Vendor>): Promise<ApiResponse<Vendor>> {
    await simulateDelay(400);
    const idx = mockVendors.findIndex(v => v.id === vendorId);
    if (idx === -1) throw new Error("Vendor not found");
    Object.assign(mockVendors[idx], data);
    return mockSuccess(mockVendors[idx], "Profile updated");
  },

  async createProduct(product: Omit<Product, "id" | "slug">): Promise<ApiResponse<Product>> {
    await simulateDelay(600);
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      slug: product.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    } as Product;
    mockProducts.push(newProduct);
    return mockSuccess(newProduct, "Product created");
  },

  async updateProduct(productId: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    await simulateDelay(400);
    const idx = mockProducts.findIndex(p => p.id === productId);
    if (idx === -1) throw new Error("Product not found");
    Object.assign(mockProducts[idx], data);
    return mockSuccess(mockProducts[idx], "Product updated");
  },

  async deleteProduct(productId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await simulateDelay(300);
    const idx = mockProducts.findIndex(p => p.id === productId);
    if (idx !== -1) mockProducts.splice(idx, 1);
    return mockSuccess({ deleted: true }, "Product deleted");
  },

  async getVendorAnalytics(vendorId: string): Promise<ApiResponse<{
    revenue: number;
    orders: number;
    products: number;
    avgRating: number;
    monthlySales: { month: string; revenue: number; orders: number }[];
  }>> {
    await simulateDelay(300);
    const products = mockProducts.filter(p => p.vendorId === vendorId);
    const orders = mockOrders.filter(o => o.vendorId === vendorId);
    return mockSuccess({
      revenue: orders.reduce((s, o) => s + o.total, 0),
      orders: orders.length,
      products: products.length,
      avgRating: products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0,
      monthlySales: [
        { month: "Jan", revenue: 2800000, orders: 120 },
        { month: "Feb", revenue: 3200000, orders: 145 },
        { month: "Mar", revenue: 2900000, orders: 132 },
      ],
    });
  },

  async getAllVendors(): Promise<ApiResponse<Vendor[]>> {
    await simulateDelay(200);
    return mockSuccess(mockVendors);
  },
};
