import { mockSuccess, mockPaginated, simulateDelay, type ApiResponse, type PaginatedResponse } from "./apiClient";
import { mockProducts, mockCategories } from "@/mocks";
import { mockReviews } from "@/mocks";
import type { Product, Category } from "@/data/mock-products";
import type { Review } from "@/data/mock-orders";

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export const productApi = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    await simulateDelay(200);
    let result = [...mockProducts];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (filters.category) {
      result = result.filter(p => p.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === filters.category);
    }
    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand);
    }
    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }

    switch (filters.sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "discount": result.sort((a, b) => b.discount - a.discount); break;
      case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
    }

    return mockPaginated(result, filters.page || 1, filters.pageSize || 12);
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<Product | null>> {
    await simulateDelay(150);
    const product = mockProducts.find(p => p.slug === slug) || null;
    return mockSuccess(product);
  },

  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    await simulateDelay(100);
    return mockSuccess(mockProducts.find(p => p.id === id) || null);
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    await simulateDelay(100);
    return mockSuccess(mockCategories);
  },

  async getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
    await simulateDelay(200);
    return mockSuccess(mockReviews.filter(r => r.productId === productId));
  },

  async submitReview(review: Omit<Review, "id" | "helpful">): Promise<ApiResponse<Review>> {
    await simulateDelay(500);
    const newReview: Review = { ...review, id: `r-${Date.now()}`, helpful: 0 };
    mockReviews.push(newReview);
    return mockSuccess(newReview, "Review submitted");
  },

  async getRelatedProducts(productId: string, limit = 4): Promise<ApiResponse<Product[]>> {
    await simulateDelay(150);
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return mockSuccess([]);
    const related = mockProducts.filter(p => p.category === product.category && p.id !== productId).slice(0, limit);
    return mockSuccess(related);
  },

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    await simulateDelay(100);
    return mockSuccess(mockProducts.filter(p => p.featured));
  },

  async getTrendingProducts(): Promise<ApiResponse<Product[]>> {
    await simulateDelay(100);
    return mockSuccess(mockProducts.filter(p => p.trending));
  },

  async getDeals(): Promise<ApiResponse<Product[]>> {
    await simulateDelay(100);
    return mockSuccess(mockProducts.filter(p => p.discount >= 20));
  },

  async searchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    await simulateDelay(100);
    if (query.length < 2) return mockSuccess([]);
    const q = query.toLowerCase();
    const names = mockProducts
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 6)
      .map(p => p.name);
    return mockSuccess(names);
  },

  async getBrands(): Promise<ApiResponse<string[]>> {
    return mockSuccess([...new Set(mockProducts.map(p => p.brand))]);
  },
};
