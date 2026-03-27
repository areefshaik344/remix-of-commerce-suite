import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const wishlistApi = {
  async getWishlist() {
    const res = await httpClient.get(ENDPOINTS.WISHLIST.LIST);
    return res.data?.data || res.data;
  },

  async toggleWishlist(productId: string) {
    const res = await httpClient.post(ENDPOINTS.WISHLIST.TOGGLE, { productId });
    return res.data?.data || res.data;
  },
};
