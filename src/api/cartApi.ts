/**
 * Cart API — Real backend calls
 */
import httpClient from "@/api/httpClient";
import { ENDPOINTS } from "@/api/endpoints";

export interface CartItemResponse {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock: number;
  variant?: string;
}

export interface CouponValidationResponse {
  coupon: {
    id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrder: number;
    maxDiscount?: number;
    label: string;
    expiresAt: string;
  };
  discountAmount: number;
}

export const cartApi = {
  async getCart(): Promise<CartItemResponse[]> {
    const res = await httpClient.get(ENDPOINTS.CART.GET);
    return res.data?.data || res.data;
  },

  async addToCart(productId: string, quantity: number, variant?: string): Promise<CartItemResponse> {
    const res = await httpClient.post(ENDPOINTS.CART.ADD, { productId, quantity, variant });
    return res.data?.data || res.data;
  },

  async updateItem(itemId: string, quantity: number): Promise<CartItemResponse> {
    const res = await httpClient.put(ENDPOINTS.CART.UPDATE(itemId), { quantity });
    return res.data?.data || res.data;
  },

  async removeItem(itemId: string): Promise<void> {
    await httpClient.delete(ENDPOINTS.CART.REMOVE(itemId));
  },

  async clearCart(): Promise<void> {
    await httpClient.delete(ENDPOINTS.CART.CLEAR);
  },

  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResponse> {
    const res = await httpClient.post(ENDPOINTS.CART.VALIDATE_COUPON, { code, cartTotal });
    return res.data?.data || res.data;
  },

  async calculateShipping(vendorId: string, pincode: string) {
    const res = await httpClient.post(ENDPOINTS.CART.SHIPPING, { vendorId, pincode });
    return res.data?.data || res.data;
  },
};
