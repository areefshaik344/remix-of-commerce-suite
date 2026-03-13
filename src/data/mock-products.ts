// Types defined here, data re-exported from mocks
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  inStock: boolean;
  stockCount: number;
  vendorId: string;
  vendorName: string;
  tags: string[];
  specs: Record<string, string>;
  variants: { name: string; options: string[] }[];
  featured: boolean;
  trending: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
  productCount: number;
}

// Re-export data from mocks
import { mockProducts, mockCategories, mockBanners, mockDeals, mockFeaturedProducts, mockTrendingProducts } from "@/mocks/mockProducts";

export const products = mockProducts;
export const categories = mockCategories;
export const banners = mockBanners;
export const deals = mockDeals;
export const featuredProducts = mockFeaturedProducts;
export const trendingProducts = mockTrendingProducts;
