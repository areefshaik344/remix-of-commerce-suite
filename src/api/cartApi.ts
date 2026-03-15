import { simulateDelay } from "./apiClient";
import type { CartItem } from "@/store/cartStore";
import type { Product } from "@/data/mock-products";

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

function respond<T>(data: T, message = "Success"): StandardResponse<T> {
  return { success: true, data, message, timestamp: new Date().toISOString() };
}

// Mock coupon engine
export interface Coupon {
  code: string;
  discount: number;
  type: "percent" | "flat";
  minOrder: number;
  maxDiscount?: number;
  label: string;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
}

export const mockCoupons: Record<string, Coupon> = {
  "SAVE10": { code: "SAVE10", discount: 10, type: "percent", minOrder: 1000, maxDiscount: 2000, label: "10% off (max ₹2000)", expiresAt: "2026-12-31", usageLimit: 100, usedCount: 45 },
  "FLAT500": { code: "FLAT500", discount: 500, type: "flat", minOrder: 3000, label: "₹500 off", expiresAt: "2026-06-30", usageLimit: 50, usedCount: 20 },
  "WELCOME": { code: "WELCOME", discount: 15, type: "percent", minOrder: 500, maxDiscount: 2000, label: "15% off (max ₹2000)", expiresAt: "2026-12-31", usageLimit: 1, usedCount: 0 },
  "FREEBIE": { code: "FREEBIE", discount: 200, type: "flat", minOrder: 0, label: "₹200 off", expiresAt: "2026-03-31", usageLimit: 200, usedCount: 150 },
  "ELECTRONICS20": { code: "ELECTRONICS20", discount: 20, type: "percent", minOrder: 5000, maxDiscount: 5000, label: "20% off electronics (max ₹5000)", expiresAt: "2026-06-30", usageLimit: 30, usedCount: 10 },
};

export const cartApi = {
  async validateCoupon(code: string, cartTotal: number): Promise<StandardResponse<{ coupon: Coupon; discount: number } | null>> {
    await simulateDelay(300);
    const coupon = mockCoupons[code.toUpperCase()];
    if (!coupon) return { success: false, data: null, message: "Invalid coupon code", timestamp: new Date().toISOString() };
    if (cartTotal < coupon.minOrder) return { success: false, data: null, message: `Minimum order ₹${coupon.minOrder} required`, timestamp: new Date().toISOString() };
    if (new Date(coupon.expiresAt) < new Date()) return { success: false, data: null, message: "Coupon has expired", timestamp: new Date().toISOString() };
    if (coupon.usedCount >= coupon.usageLimit) return { success: false, data: null, message: "Coupon usage limit reached", timestamp: new Date().toISOString() };

    let discount = 0;
    if (coupon.type === "percent") {
      discount = Math.min(Math.round(cartTotal * coupon.discount / 100), coupon.maxDiscount || Infinity);
    } else {
      discount = coupon.discount;
    }
    return respond({ coupon, discount }, "Coupon applied");
  },

  async calculateShipping(vendorId: string, pincode: string): Promise<StandardResponse<{ cost: number; estimatedDays: number }>> {
    await simulateDelay(200);
    const cost = pincode.startsWith("4") ? 0 : 49; // Free in Mumbai region
    const estimatedDays = pincode.startsWith("4") ? 2 : 5;
    return respond({ cost, estimatedDays });
  },
};
