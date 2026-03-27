import { useCallback } from "react";

type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "add_to_wishlist"
  | "remove_from_wishlist"
  | "begin_checkout"
  | "purchase"
  | "search"
  | "filter_applied"
  | "signup"
  | "login"
  | "logout"
  | "review_submitted"
  | "compare_add"
  | "coupon_applied";

interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

// In production, replace with real analytics provider (GA4, Segment, Mixpanel)
function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}`, payload);
  }
  // Future: window.gtag?.('event', event, payload);
  // Future: window.analytics?.track(event, payload);
}

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent, payload?: AnalyticsPayload) => {
    trackEvent(event, payload);
  }, []);

  const trackProductView = useCallback((productId: string, productName: string, price: number) => {
    trackEvent("product_view", { productId, productName, price });
  }, []);

  const trackAddToCart = useCallback((productId: string, productName: string, price: number, quantity: number) => {
    trackEvent("add_to_cart", { productId, productName, price, quantity, value: price * quantity });
  }, []);

  const trackPurchase = useCallback((orderId: string, total: number, itemCount: number) => {
    trackEvent("purchase", { orderId, total, itemCount });
  }, []);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent("search", { query, resultsCount });
  }, []);

  const trackBeginCheckout = useCallback((total: number, itemCount: number) => {
    trackEvent("begin_checkout", { total, itemCount });
  }, []);

  return {
    track,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch,
    trackBeginCheckout,
  };
}
