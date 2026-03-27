/**
 * API Endpoints Registry
 * Central mapping of all backend API paths for easy maintenance.
 */

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    ME: "/auth/me",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    SESSIONS: "/auth/sessions",
    REVOKE_SESSION: (id: string) => `/auth/sessions/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    CATEGORIES: "/products/categories",
    BRANDS: "/products/brands",
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
    TRENDING: "/products/trending",
    DEALS: "/products/deals",
    RELATED: (id: string) => `/products/${id}/related`,
  },

  // Cart
  CART: {
    GET: "/cart",
    ADD: "/cart/items",
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: "/cart/clear",
    VALIDATE_COUPON: "/cart/validate-coupon",
    SHIPPING: "/cart/shipping",
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: "/orders",
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    RETURN: (id: string) => `/orders/${id}/return`,
    TRACK: (id: string) => `/orders/${id}/track`,
  },

  // Reviews
  REVIEWS: {
    BY_PRODUCT: (productId: string) => `/products/${productId}/reviews`,
    CREATE: "/reviews",
    HELPFUL: (reviewId: string) => `/reviews/${reviewId}/helpful`,
  },

  // Wishlist
  WISHLIST: {
    LIST: "/wishlist",
    TOGGLE: "/wishlist/toggle",
  },

  // Vendor
  VENDOR: {
    PROFILE: "/vendor/profile",
    PRODUCTS: "/vendor/products",
    PRODUCT_DETAIL: (id: string) => `/vendor/products/${id}`,
    ORDERS: "/vendor/orders",
    ORDER_DETAIL: (id: string) => `/vendor/orders/${id}`,
    ANALYTICS: "/vendor/analytics",
    FINANCIALS: "/vendor/financials",
    INVENTORY: "/vendor/inventory",
    INVENTORY_UPDATE: (id: string) => `/vendor/inventory/${id}`,
    COUPONS: "/vendor/coupons",
    COUPON_DETAIL: (id: string) => `/vendor/coupons/${id}`,
    COUPON_CREATE: "/vendor/coupons",
    RETURNS: "/vendor/returns",
    RETURN_DETAIL: (id: string) => `/vendor/returns/${id}`,
    STORE: (vendorId: string) => `/vendors/${vendorId}`,
    STORE_PRODUCTS: (vendorId: string) => `/vendors/${vendorId}/products`,
    SHIPPING_SETTINGS: "/vendor/shipping-settings",
    ONBOARDING: "/vendor/onboarding",
    STORE_CUSTOMIZATION: "/vendor/store-customization",
    PAYOUTS: "/vendor/payouts",
    BULK_UPLOAD: "/vendor/products/bulk-upload",
    LOW_STOCK: "/vendor/inventory/low-stock",
  },

  // Admin
  ADMIN: {
    USERS: "/admin/users",
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    USER_TOGGLE: (id: string) => `/admin/users/${id}/toggle-active`,
    VENDORS: "/admin/vendors",
    VENDOR_DETAIL: (id: string) => `/admin/vendors/${id}`,
    VENDOR_APPROVE: (id: string) => `/admin/vendors/${id}/approve`,
    VENDOR_REJECT: (id: string) => `/admin/vendors/${id}/reject`,
    PRODUCTS: "/admin/products",
    PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
    ORDERS: "/admin/orders",
    ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
    ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
    ORDER_REFUND: (id: string) => `/admin/orders/${id}/refund`,
    ANALYTICS: "/admin/analytics",
    REPORTING: "/admin/reporting",
    COUPONS: "/admin/coupons",
    COUPON_CREATE: "/admin/coupons",
    COUPON_TOGGLE: (id: string) => `/admin/coupons/${id}/toggle`,
    COUPON_DELETE: (id: string) => `/admin/coupons/${id}`,
    CATEGORIES: "/admin/categories",
    CATEGORY_DETAIL: (id: string) => `/admin/categories/${id}`,
    AUDIT_LOG: "/admin/audit-log",
    VENDOR_APPLICATIONS: "/admin/vendor-applications",
    VENDOR_APPLICATION_APPROVE: (id: string) => `/admin/vendor-applications/${id}/approve`,
    VENDOR_APPLICATION_REJECT: (id: string) => `/admin/vendor-applications/${id}/reject`,
    SETTINGS: "/admin/settings",
    BANNERS: "/admin/banners",
    BANNER_DETAIL: (id: string) => `/admin/banners/${id}`,
    SECTIONS: "/admin/sections",
    PAGES: "/admin/pages",
    PAGE_DETAIL: (id: string) => `/admin/pages/${id}`,
    COMMISSION: "/admin/commission",
    COMMISSION_OVERRIDES: "/admin/commission/overrides",
    FRAUD_ORDERS: "/admin/fraud/orders",
    FRAUD_REVIEWS: "/admin/fraud/reviews",
    FRAUD_REPORTS: "/admin/fraud/reports",
    FRAUD_ACTION: (id: string) => `/admin/fraud/${id}/action`,
    EMAIL_TEMPLATES: "/admin/email-templates",
    EMAIL_TEMPLATE_DETAIL: (id: string) => `/admin/email-templates/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    CREATE: "/notifications",
    SEND_EMAIL: "/notifications/email",
  },

  // User
  USER: {
    PROFILE: "/users/profile",
    ADDRESSES: "/users/addresses",
    ADDRESS_DETAIL: (id: string) => `/users/addresses/${id}`,
    ADDRESS_DEFAULT: (id: string) => `/users/addresses/${id}/default`,
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },
} as const;
