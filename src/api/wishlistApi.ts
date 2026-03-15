import { simulateDelay } from "./apiClient";

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

function respond<T>(data: T, message = "Success"): StandardResponse<T> {
  return { success: true, data, message, timestamp: new Date().toISOString() };
}

export const wishlistApi = {
  async getWishlist(userId: string): Promise<StandardResponse<string[]>> {
    await simulateDelay(200);
    // In real app, fetch from DB; here we return empty as state is client-managed
    return respond([], "Wishlist loaded");
  },

  async addToWishlist(userId: string, productId: string): Promise<StandardResponse<{ productId: string }>> {
    await simulateDelay(100);
    return respond({ productId }, "Added to wishlist");
  },

  async removeFromWishlist(userId: string, productId: string): Promise<StandardResponse<{ productId: string }>> {
    await simulateDelay(100);
    return respond({ productId }, "Removed from wishlist");
  },
};
