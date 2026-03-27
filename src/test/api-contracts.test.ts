import { describe, it, expect } from "vitest";
import { ENDPOINTS } from "@/api/endpoints";

/**
 * Comprehensive API contract tests — ensures all endpoints are properly
 * defined and match the expected frontend → backend contract.
 */

describe("API Endpoints Registry", () => {
  // ── Auth ───────────────────────────────────────────────
  describe("AUTH endpoints", () => {
    it("has all auth paths", () => {
      expect(ENDPOINTS.AUTH.LOGIN).toBe("/auth/login");
      expect(ENDPOINTS.AUTH.REGISTER).toBe("/auth/register");
      expect(ENDPOINTS.AUTH.LOGOUT).toBe("/auth/logout");
      expect(ENDPOINTS.AUTH.LOGOUT_ALL).toBe("/auth/logout-all");
      expect(ENDPOINTS.AUTH.REFRESH).toBe("/auth/refresh");
      expect(ENDPOINTS.AUTH.FORGOT_PASSWORD).toBe("/auth/forgot-password");
      expect(ENDPOINTS.AUTH.RESET_PASSWORD).toBe("/auth/reset-password");
      expect(ENDPOINTS.AUTH.VERIFY_EMAIL).toBe("/auth/verify-email");
      expect(ENDPOINTS.AUTH.ME).toBe("/auth/me");
      expect(ENDPOINTS.AUTH.SESSIONS).toBe("/auth/sessions");
    });

    it("generates dynamic session revoke path", () => {
      expect(ENDPOINTS.AUTH.REVOKE_SESSION("s1")).toBe("/auth/sessions/s1");
    });
  });

  // ── Products ───────────────────────────────────────────
  describe("PRODUCTS endpoints", () => {
    it("has all product listing paths", () => {
      expect(ENDPOINTS.PRODUCTS.LIST).toBe("/products");
      expect(ENDPOINTS.PRODUCTS.CATEGORIES).toBe("/products/categories");
      expect(ENDPOINTS.PRODUCTS.BRANDS).toBe("/products/brands");
      expect(ENDPOINTS.PRODUCTS.SEARCH).toBe("/products/search");
      expect(ENDPOINTS.PRODUCTS.FEATURED).toBe("/products/featured");
      expect(ENDPOINTS.PRODUCTS.TRENDING).toBe("/products/trending");
      expect(ENDPOINTS.PRODUCTS.DEALS).toBe("/products/deals");
    });

    it("generates dynamic product paths", () => {
      expect(ENDPOINTS.PRODUCTS.DETAIL("p1")).toBe("/products/p1");
      expect(ENDPOINTS.PRODUCTS.BY_SLUG("iphone")).toBe("/products/slug/iphone");
      expect(ENDPOINTS.PRODUCTS.RELATED("p1")).toBe("/products/p1/related");
    });
  });

  // ── Cart ───────────────────────────────────────────────
  describe("CART endpoints", () => {
    it("has all cart paths", () => {
      expect(ENDPOINTS.CART.GET).toBe("/cart");
      expect(ENDPOINTS.CART.ADD).toBe("/cart/items");
      expect(ENDPOINTS.CART.CLEAR).toBe("/cart/clear");
      expect(ENDPOINTS.CART.VALIDATE_COUPON).toBe("/cart/validate-coupon");
      expect(ENDPOINTS.CART.SHIPPING).toBe("/cart/shipping");
    });

    it("generates dynamic cart item paths", () => {
      expect(ENDPOINTS.CART.UPDATE("item1")).toBe("/cart/items/item1");
      expect(ENDPOINTS.CART.REMOVE("item1")).toBe("/cart/items/item1");
    });
  });

  // ── Orders ─────────────────────────────────────────────
  describe("ORDERS endpoints", () => {
    it("has all order paths", () => {
      expect(ENDPOINTS.ORDERS.LIST).toBe("/orders");
      expect(ENDPOINTS.ORDERS.CREATE).toBe("/orders");
    });

    it("generates dynamic order paths", () => {
      expect(ENDPOINTS.ORDERS.DETAIL("o1")).toBe("/orders/o1");
      expect(ENDPOINTS.ORDERS.CANCEL("o1")).toBe("/orders/o1/cancel");
      expect(ENDPOINTS.ORDERS.RETURN("o1")).toBe("/orders/o1/return");
      expect(ENDPOINTS.ORDERS.TRACK("o1")).toBe("/orders/o1/track");
    });
  });

  // ── Reviews ────────────────────────────────────────────
  describe("REVIEWS endpoints", () => {
    it("has review paths", () => {
      expect(ENDPOINTS.REVIEWS.CREATE).toBe("/reviews");
    });

    it("generates dynamic review paths", () => {
      expect(ENDPOINTS.REVIEWS.BY_PRODUCT("p1")).toBe("/products/p1/reviews");
      expect(ENDPOINTS.REVIEWS.HELPFUL("r1")).toBe("/reviews/r1/helpful");
    });
  });

  // ── Wishlist ───────────────────────────────────────────
  describe("WISHLIST endpoints", () => {
    it("has wishlist paths", () => {
      expect(ENDPOINTS.WISHLIST.LIST).toBe("/wishlist");
      expect(ENDPOINTS.WISHLIST.TOGGLE).toBe("/wishlist/toggle");
    });
  });

  // ── Vendor ─────────────────────────────────────────────
  describe("VENDOR endpoints", () => {
    it("has all vendor paths", () => {
      expect(ENDPOINTS.VENDOR.PROFILE).toBe("/vendor/profile");
      expect(ENDPOINTS.VENDOR.PRODUCTS).toBe("/vendor/products");
      expect(ENDPOINTS.VENDOR.ORDERS).toBe("/vendor/orders");
      expect(ENDPOINTS.VENDOR.ANALYTICS).toBe("/vendor/analytics");
      expect(ENDPOINTS.VENDOR.FINANCIALS).toBe("/vendor/financials");
      expect(ENDPOINTS.VENDOR.INVENTORY).toBe("/vendor/inventory");
      expect(ENDPOINTS.VENDOR.COUPONS).toBe("/vendor/coupons");
      expect(ENDPOINTS.VENDOR.RETURNS).toBe("/vendor/returns");
      expect(ENDPOINTS.VENDOR.SHIPPING_SETTINGS).toBe("/vendor/shipping-settings");
      expect(ENDPOINTS.VENDOR.ONBOARDING).toBe("/vendor/onboarding");
      expect(ENDPOINTS.VENDOR.STORE_CUSTOMIZATION).toBe("/vendor/store-customization");
      expect(ENDPOINTS.VENDOR.PAYOUTS).toBe("/vendor/payouts");
      expect(ENDPOINTS.VENDOR.BULK_UPLOAD).toBe("/vendor/products/bulk-upload");
      expect(ENDPOINTS.VENDOR.LOW_STOCK).toBe("/vendor/inventory/low-stock");
    });

    it("generates dynamic vendor paths", () => {
      expect(ENDPOINTS.VENDOR.PRODUCT_DETAIL("p1")).toBe("/vendor/products/p1");
      expect(ENDPOINTS.VENDOR.ORDER_DETAIL("o1")).toBe("/vendor/orders/o1");
      expect(ENDPOINTS.VENDOR.INVENTORY_UPDATE("p1")).toBe("/vendor/inventory/p1");
      expect(ENDPOINTS.VENDOR.COUPON_DETAIL("c1")).toBe("/vendor/coupons/c1");
      expect(ENDPOINTS.VENDOR.RETURN_DETAIL("r1")).toBe("/vendor/returns/r1");
      expect(ENDPOINTS.VENDOR.STORE("v1")).toBe("/vendors/v1");
      expect(ENDPOINTS.VENDOR.STORE_PRODUCTS("v1")).toBe("/vendors/v1/products");
    });
  });

  // ── Admin ──────────────────────────────────────────────
  describe("ADMIN endpoints", () => {
    it("has all admin resource paths", () => {
      expect(ENDPOINTS.ADMIN.USERS).toBe("/admin/users");
      expect(ENDPOINTS.ADMIN.VENDORS).toBe("/admin/vendors");
      expect(ENDPOINTS.ADMIN.PRODUCTS).toBe("/admin/products");
      expect(ENDPOINTS.ADMIN.ORDERS).toBe("/admin/orders");
      expect(ENDPOINTS.ADMIN.ANALYTICS).toBe("/admin/analytics");
      expect(ENDPOINTS.ADMIN.REPORTING).toBe("/admin/reporting");
      expect(ENDPOINTS.ADMIN.COUPONS).toBe("/admin/coupons");
      expect(ENDPOINTS.ADMIN.CATEGORIES).toBe("/admin/categories");
      expect(ENDPOINTS.ADMIN.AUDIT_LOG).toBe("/admin/audit-log");
      expect(ENDPOINTS.ADMIN.VENDOR_APPLICATIONS).toBe("/admin/vendor-applications");
      expect(ENDPOINTS.ADMIN.SETTINGS).toBe("/admin/settings");
      expect(ENDPOINTS.ADMIN.BANNERS).toBe("/admin/banners");
      expect(ENDPOINTS.ADMIN.SECTIONS).toBe("/admin/sections");
      expect(ENDPOINTS.ADMIN.PAGES).toBe("/admin/pages");
      expect(ENDPOINTS.ADMIN.COMMISSION).toBe("/admin/commission");
      expect(ENDPOINTS.ADMIN.COMMISSION_OVERRIDES).toBe("/admin/commission/overrides");
      expect(ENDPOINTS.ADMIN.FRAUD_ORDERS).toBe("/admin/fraud/orders");
      expect(ENDPOINTS.ADMIN.FRAUD_REVIEWS).toBe("/admin/fraud/reviews");
      expect(ENDPOINTS.ADMIN.FRAUD_REPORTS).toBe("/admin/fraud/reports");
      expect(ENDPOINTS.ADMIN.EMAIL_TEMPLATES).toBe("/admin/email-templates");
    });

    it("generates dynamic admin paths", () => {
      expect(ENDPOINTS.ADMIN.USER_DETAIL("u1")).toBe("/admin/users/u1");
      expect(ENDPOINTS.ADMIN.USER_TOGGLE("u1")).toBe("/admin/users/u1/toggle-active");
      expect(ENDPOINTS.ADMIN.VENDOR_DETAIL("v1")).toBe("/admin/vendors/v1");
      expect(ENDPOINTS.ADMIN.VENDOR_APPROVE("v1")).toBe("/admin/vendors/v1/approve");
      expect(ENDPOINTS.ADMIN.VENDOR_REJECT("v1")).toBe("/admin/vendors/v1/reject");
      expect(ENDPOINTS.ADMIN.PRODUCT_DETAIL("p1")).toBe("/admin/products/p1");
      expect(ENDPOINTS.ADMIN.ORDER_DETAIL("o1")).toBe("/admin/orders/o1");
      expect(ENDPOINTS.ADMIN.ORDER_STATUS("o1")).toBe("/admin/orders/o1/status");
      expect(ENDPOINTS.ADMIN.ORDER_REFUND("o1")).toBe("/admin/orders/o1/refund");
      expect(ENDPOINTS.ADMIN.COUPON_TOGGLE("c1")).toBe("/admin/coupons/c1/toggle");
      expect(ENDPOINTS.ADMIN.COUPON_DELETE("c1")).toBe("/admin/coupons/c1");
      expect(ENDPOINTS.ADMIN.CATEGORY_DETAIL("cat1")).toBe("/admin/categories/cat1");
      expect(ENDPOINTS.ADMIN.BANNER_DETAIL("b1")).toBe("/admin/banners/b1");
      expect(ENDPOINTS.ADMIN.PAGE_DETAIL("pg1")).toBe("/admin/pages/pg1");
      expect(ENDPOINTS.ADMIN.FRAUD_ACTION("f1")).toBe("/admin/fraud/f1/action");
      expect(ENDPOINTS.ADMIN.EMAIL_TEMPLATE_DETAIL("et1")).toBe("/admin/email-templates/et1");
      expect(ENDPOINTS.ADMIN.VENDOR_APPLICATION_APPROVE("va1")).toBe("/admin/vendor-applications/va1/approve");
      expect(ENDPOINTS.ADMIN.VENDOR_APPLICATION_REJECT("va1")).toBe("/admin/vendor-applications/va1/reject");
    });
  });

  // ── Notifications ──────────────────────────────────────
  describe("NOTIFICATIONS endpoints", () => {
    it("has all notification paths", () => {
      expect(ENDPOINTS.NOTIFICATIONS.LIST).toBe("/notifications");
      expect(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT).toBe("/notifications/unread-count");
      expect(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ).toBe("/notifications/read-all");
      expect(ENDPOINTS.NOTIFICATIONS.CREATE).toBe("/notifications");
      expect(ENDPOINTS.NOTIFICATIONS.SEND_EMAIL).toBe("/notifications/email");
    });

    it("generates dynamic notification paths", () => {
      expect(ENDPOINTS.NOTIFICATIONS.MARK_READ("n1")).toBe("/notifications/n1/read");
    });
  });

  // ── User ───────────────────────────────────────────────
  describe("USER endpoints", () => {
    it("has all user paths", () => {
      expect(ENDPOINTS.USER.PROFILE).toBe("/users/profile");
      expect(ENDPOINTS.USER.ADDRESSES).toBe("/users/addresses");
      expect(ENDPOINTS.USER.UPDATE_PROFILE).toBe("/users/profile");
    });

    it("generates dynamic user paths", () => {
      expect(ENDPOINTS.USER.ADDRESS_DETAIL("a1")).toBe("/users/addresses/a1");
      expect(ENDPOINTS.USER.ADDRESS_DEFAULT("a1")).toBe("/users/addresses/a1/default");
    });
  });
});

// ── API layer method existence ───────────────────────────
describe("API layer completeness", () => {
  it("adminApi has all methods", async () => {
    const { adminApi } = await import("@/api/adminApi");
    const methods = [
      "getDashboardStats", "getUsers", "getUserById", "toggleUserActive", "deleteUser",
      "getVendors", "getVendorById", "approveVendor", "rejectVendor",
      "getAllOrders", "updateOrderStatus", "getOrderById", "refundOrder",
      "getAllProducts", "getProductById",
      "getCategories", "createCategory", "updateCategory", "deleteCategory",
      "getCoupons", "createCoupon", "toggleCoupon", "deleteCoupon",
      "getAnalytics", "getReporting", "getAuditLog",
      "getVendorApplications", "approveVendorApplication", "rejectVendorApplication",
      "getSettings", "updateSettings",
      "getBanners", "getBannerById", "createBanner", "updateBanner", "deleteBanner",
      "getSections", "updateSections", "getPages", "deletePage",
      "getCommissionRates", "updateCommissionRates", "getCommissionOverrides",
      "getFraudOrders", "getFraudReviews", "getFraudReports", "takeFraudAction",
      "getEmailTemplates", "updateEmailTemplate",
    ];
    methods.forEach(m => {
      expect(typeof (adminApi as any)[m]).toBe("function");
    });
  });

  it("vendorApi has all methods", async () => {
    const { vendorApi } = await import("@/api/vendorApi");
    const methods = [
      "getVendorProfile", "updateVendorProfile",
      "getVendorProducts", "createProduct", "updateProduct", "deleteProduct",
      "getVendorOrders", "getVendorOrderById", "updateOrderStatus",
      "getVendorAnalytics", "getVendorFinancials",
      "getVendorCoupons", "createCoupon", "deleteCoupon",
      "getShippingSettings", "updateShippingSettings",
      "getVendorInventory", "updateInventory",
      "getVendorReturns", "updateReturnStatus",
      "getVendorBySlug", "getVendorStoreProducts", "getAllVendors",
      "submitOnboarding", "getStoreCustomization", "updateStoreCustomization",
      "getPayoutHistory", "bulkUploadProducts", "getLowStockProducts",
    ];
    methods.forEach(m => {
      expect(typeof (vendorApi as any)[m]).toBe("function");
    });
  });

  it("orderApi has all methods", async () => {
    const { orderApi } = await import("@/api/orderApi");
    const methods = ["getOrders", "getOrderById", "createOrder", "cancelOrder", "updateOrderStatus", "requestReturn", "trackOrder"];
    methods.forEach(m => {
      expect(typeof (orderApi as any)[m]).toBe("function");
    });
  });

  it("cartApi has all methods", async () => {
    const { cartApi } = await import("@/api/cartApi");
    const methods = ["getCart", "addToCart", "updateItem", "removeItem", "clearCart", "validateCoupon", "calculateShipping"];
    methods.forEach(m => {
      expect(typeof (cartApi as any)[m]).toBe("function");
    });
  });

  it("reviewApi has all methods", async () => {
    const { reviewApi } = await import("@/api/reviewApi");
    const methods = ["getProductReviews", "submitReview", "markHelpful"];
    methods.forEach(m => {
      expect(typeof (reviewApi as any)[m]).toBe("function");
    });
  });
});
