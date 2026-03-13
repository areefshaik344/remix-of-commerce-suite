import { mockSuccess, simulateDelay, type ApiResponse } from "./apiClient";
import { mockUsers, mockVendors } from "@/mocks";
import { mockOrders, mockAnalyticsData } from "@/mocks";
import { mockProducts } from "@/mocks";
import type { User, Vendor } from "@/data/mock-users";

export interface VendorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  category: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export const adminApi = {
  async getDashboardStats(): Promise<ApiResponse<typeof mockAnalyticsData>> {
    await simulateDelay(300);
    return mockSuccess(mockAnalyticsData);
  },

  async getUsers(): Promise<ApiResponse<User[]>> {
    await simulateDelay(200);
    return mockSuccess(mockUsers);
  },

  async getUserById(userId: string): Promise<ApiResponse<User | null>> {
    await simulateDelay(150);
    return mockSuccess(mockUsers.find(u => u.id === userId) || null);
  },

  async getVendors(): Promise<ApiResponse<Vendor[]>> {
    await simulateDelay(200);
    return mockSuccess(mockVendors);
  },

  async approveVendor(vendorId: string): Promise<ApiResponse<Vendor>> {
    await simulateDelay(400);
    const vendor = mockVendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    vendor.status = "active";
    return mockSuccess(vendor, "Vendor approved");
  },

  async suspendVendor(vendorId: string): Promise<ApiResponse<Vendor>> {
    await simulateDelay(400);
    const vendor = mockVendors.find(v => v.id === vendorId);
    if (!vendor) throw new Error("Vendor not found");
    vendor.status = "suspended";
    return mockSuccess(vendor, "Vendor suspended");
  },

  async getAllOrders(): Promise<ApiResponse<typeof mockOrders>> {
    await simulateDelay(300);
    return mockSuccess(mockOrders);
  },

  async getAllProducts(): Promise<ApiResponse<typeof mockProducts>> {
    await simulateDelay(200);
    return mockSuccess([...mockProducts]);
  },

  async deleteUser(userId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await simulateDelay(300);
    return mockSuccess({ deleted: true }, "User deleted");
  },

  async getAuditLog(): Promise<ApiResponse<{
    id: string;
    action: string;
    user: string;
    details: string;
    timestamp: string;
    severity: string;
  }[]>> {
    await simulateDelay(200);
    return mockSuccess([
      { id: "log-1", action: "User Login", user: "admin@marketplace.com", details: "Successful admin login", timestamp: "2025-03-13T10:30:00", severity: "info" },
      { id: "log-2", action: "Vendor Approved", user: "admin@marketplace.com", details: "Approved vendor: GadgetPro", timestamp: "2025-03-12T14:20:00", severity: "info" },
      { id: "log-3", action: "Product Flagged", user: "system", details: "Product flagged for review: Suspicious listing", timestamp: "2025-03-11T09:15:00", severity: "warning" },
      { id: "log-4", action: "Order Refund", user: "admin@marketplace.com", details: "Refund processed: ORD-10006 ₹6,998", timestamp: "2025-03-10T16:45:00", severity: "info" },
      { id: "log-5", action: "Failed Login", user: "unknown@test.com", details: "5 failed login attempts", timestamp: "2025-03-09T23:10:00", severity: "error" },
    ]);
  },
};
