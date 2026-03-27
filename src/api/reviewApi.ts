import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const reviewApi = {
  async getProductReviews(productId: string) {
    const res = await httpClient.get(ENDPOINTS.REVIEWS.BY_PRODUCT(productId));
    return res.data?.data || res.data;
  },

  async submitReview(review: { productId: string; rating: number; title: string; comment: string }) {
    const res = await httpClient.post(ENDPOINTS.REVIEWS.CREATE, review);
    return res.data?.data || res.data;
  },

  async markHelpful(reviewId: string) {
    const res = await httpClient.patch(ENDPOINTS.REVIEWS.HELPFUL(reviewId));
    return res.data?.data || res.data;
  },
};
