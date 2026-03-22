/**
 * Features — Master Barrel Export
 *
 * Provides clean import paths for all feature modules:
 *   import { useAuth } from "@/features/auth";
 *   import { useCartStore } from "@/features/cart";
 *   import { products } from "@/features/product";
 *   import type { Product } from "@/features/product";
 */

// Re-export each feature namespace individually for tree-shaking.
// Use direct feature imports for best results:
//   import { useAuth } from "@/features/auth";
//   NOT: import { useAuth } from "@/features";
