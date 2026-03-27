/**
 * Centralized API Request/Response DTOs
 * These types mirror the Spring Boot API contract for type-safe integration.
 */

// ── Standard Response Wrapper ────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;

// ── Error Response ───────────────────────────────────────────────────────
export interface ApiErrorResponse {
  success: false;
  message: string;
  timestamp: string;
  errors?: FieldError[];
  errorCode?: string;
}

export interface FieldError {
  field: string;
  message: string;
}

// ── Auth DTOs ────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDTO;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignupResponse {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ── User DTOs ────────────────────────────────────────────────────────────
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "vendor" | "admin";
  joinedDate: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface AddressDTO {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label: "home" | "work" | "other";
  isDefault: boolean;
}

export interface CreateAddressRequest {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label: "home" | "work" | "other";
  isDefault?: boolean;
}

// ── Product DTOs ─────────────────────────────────────────────────────────
export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  rating: number;
  reviewCount: number;
  vendorId: string;
  vendorName: string;
  stock: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  tags: string[];
  featured: boolean;
  trending: boolean;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface ProductFiltersRequest {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "rating" | "discount" | "newest";
  page?: number;
  pageSize?: number;
  vendorId?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  stock: number;
  tags: string[];
  featured: boolean;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

// ── Cart DTOs ────────────────────────────────────────────────────────────
export interface CartItemDTO {
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CouponValidationRequest {
  code: string;
  cartTotal: number;
}

export interface CouponDTO {
  code: string;
  discount: number;
  type: "percent" | "flat";
  minOrder: number;
  maxDiscount?: number;
  label: string;
  expiresAt: string;
}

export interface CouponValidationResponse {
  coupon: CouponDTO;
  discountAmount: number;
}

export interface ShippingEstimateRequest {
  vendorId: string;
  pincode: string;
}

export interface ShippingEstimateResponse {
  cost: number;
  estimatedDays: number;
  freeAbove?: number;
}

// ── Order DTOs ───────────────────────────────────────────────────────────
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "refunded";

export interface OrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CreateOrderRequest {
  items: OrderItemDTO[];
  shippingAddressId: string;
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  couponCode?: string;
}

export interface OrderDTO {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItemDTO[];
  total: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  shippingAddress: AddressDTO;
  vendorOrders: VendorOrderDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface VendorOrderDTO {
  id: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  items: OrderItemDTO[];
  subtotal: number;
  shipping: number;
  timeline: OrderTimelineEntry[];
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface ReturnRequest {
  orderId: string;
  reason: string;
  items: string[]; // productIds
}

// ── Review DTOs ──────────────────────────────────────────────────────────
export interface ReviewDTO {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

// ── Vendor DTOs ──────────────────────────────────────────────────────────
export interface VendorDTO {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  logo: string;
  banner: string;
  category: string;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  status: "pending" | "active" | "suspended";
  joinedDate: string;
}

export interface VendorRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  storeName: string;
  category: string;
  description: string;
}

export interface VendorAnalyticsDTO {
  revenue: number;
  orders: number;
  products: number;
  avgRating: number;
  monthlySales: { month: string; revenue: number; orders: number }[];
  topProducts: { productId: string; name: string; sales: number; revenue: number }[];
}

export interface VendorFinancialsDTO {
  totalEarnings: number;
  pendingPayout: number;
  lastPayout: number;
  commissionRate: number;
  settlements: { id: string; amount: number; date: string; status: "completed" | "pending" }[];
}

// ── Admin DTOs ───────────────────────────────────────────────────────────
export interface VendorApplicationDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  category: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
}

export interface PlatformAnalyticsDTO {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  ordersByStatus: Record<OrderStatus, number>;
}

// ── Notification DTOs ────────────────────────────────────────────────────
export interface NotificationDTO {
  id: string;
  type: "order" | "promo" | "system" | "vendor" | "alert";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  timestamp: string;
}
