import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

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
  async getProducts(filters: ProductFilters = {}) {
    const params: Record<string, string | number> = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.minRating !== undefined) params.minRating = filters.minRating;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    params.page = (filters.page || 1) - 1; // Backend is 0-indexed
    params.size = filters.pageSize || 12;

    const res = await httpClient.get(ENDPOINTS.PRODUCTS.LIST, { params });
    return res.data?.data || res.data;
  },

  async getProductBySlug(slug: string) {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return res.data?.data || res.data;
  },

  async getProductById(id: string) {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.DETAIL(id));
    return res.data?.data || res.data;
  },

  async getCategories() {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.CATEGORIES);
    return res.data?.data || res.data;
  },

  async getProductReviews(productId: string) {
    const res = await httpClient.get(ENDPOINTS.REVIEWS.BY_PRODUCT(productId));
    return res.data?.data || res.data;
  },

  async submitReview(review: { productId: string; rating: number; title: string; comment: string }) {
    const res = await httpClient.post(ENDPOINTS.REVIEWS.CREATE, review);
    return res.data?.data || res.data;
  },

  async getRelatedProducts(productId: string, limit = 4) {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.RELATED(productId), { params: { limit } });
    return res.data?.data || res.data;
  },

  async getFeaturedProducts() {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.FEATURED);
    return res.data?.data || res.data;
  },

  async getTrendingProducts() {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.TRENDING);
    return res.data?.data || res.data;
  },

  async getDeals() {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.DEALS);
    return res.data?.data || res.data;
  },

  async searchSuggestions(query: string) {
    if (query.length < 2) return [];
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.SEARCH, { params: { q: query, limit: 6 } });
    return res.data?.data || res.data;
  },

  async getBrands() {
    const res = await httpClient.get(ENDPOINTS.PRODUCTS.BRANDS);
    return res.data?.data || res.data;
  },
};
