import { simulateDelay } from "./apiClient";
import { mockReviews } from "@/mocks";
import type { Review } from "@/data/mock-orders";

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

function respond<T>(data: T, message = "Success"): StandardResponse<T> {
  return { success: true, data, message, timestamp: new Date().toISOString() };
}

export const reviewApi = {
  async getProductReviews(productId: string): Promise<StandardResponse<Review[]>> {
    await simulateDelay(200);
    return respond(mockReviews.filter(r => r.productId === productId));
  },

  async submitReview(review: Omit<Review, "id" | "helpful">): Promise<StandardResponse<Review>> {
    await simulateDelay(400);
    const newReview: Review = { ...review, id: `r-${Date.now()}`, helpful: 0 };
    mockReviews.push(newReview);
    return respond(newReview, "Review submitted");
  },

  async markHelpful(reviewId: string): Promise<StandardResponse<Review>> {
    await simulateDelay(200);
    const review = mockReviews.find(r => r.id === reviewId);
    if (!review) throw new Error("Review not found");
    review.helpful += 1;
    return respond(review);
  },
};
