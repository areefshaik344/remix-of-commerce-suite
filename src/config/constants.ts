export const APP_NAME = "MarketHub";
export const APP_DESCRIPTION = "India's Premier Multi-Vendor Marketplace";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = "/api/v1";
export const API_TIMEOUT = 5000;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
};

export const CART = {
  MAX_QUANTITY: 10,
  MAX_ITEMS: 50,
};

export const COMPARE = {
  MAX_ITEMS: 4,
};

export const SEARCH = {
  MAX_HISTORY: 10,
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_MS: 300,
};

export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  locale: "en-IN",
};

export const formatPrice = (price: number): string =>
  `${CURRENCY.symbol}${price.toLocaleString(CURRENCY.locale)}`;

export const ROLES = {
  ADMIN: "admin" as const,
  VENDOR: "vendor" as const,
  CUSTOMER: "customer" as const,
};
