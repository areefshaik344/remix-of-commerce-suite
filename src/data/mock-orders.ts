export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  trackingId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
}

export const orders: Order[] = [
  { id: "ORD-10001", userId: "u-1", vendorId: "v-1", items: [{ productId: "prod-1", productName: "iPhone 15 Pro Max", quantity: 1, price: 134900, image: "" }], total: 134900, status: "delivered", paymentMethod: "UPI", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2024-12-15T10:30:00", updatedAt: "2024-12-20T14:00:00", trackingId: "TRK9876543210" },
  { id: "ORD-10002", userId: "u-1", vendorId: "v-4", items: [{ productId: "prod-5", productName: "Nike Air Max 270 React", quantity: 2, price: 12995, image: "" }], total: 25990, status: "shipped", paymentMethod: "Card", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-01-10T08:15:00", updatedAt: "2025-01-12T11:00:00", trackingId: "TRK1234567890" },
  { id: "ORD-10003", userId: "u-4", vendorId: "v-3", items: [{ productId: "prod-4", productName: "Sony WH-1000XM5", quantity: 1, price: 26990, image: "" }, { productId: "prod-10", productName: "PlayStation 5 Console", quantity: 1, price: 49990, image: "" }], total: 76980, status: "confirmed", paymentMethod: "Net Banking", shippingAddress: "15, Connaught Place, Delhi", createdAt: "2025-02-01T16:45:00", updatedAt: "2025-02-01T17:00:00" },
  { id: "ORD-10004", userId: "u-5", vendorId: "v-7", items: [{ productId: "prod-8", productName: "The Alchemist", quantity: 3, price: 299, image: "" }], total: 897, status: "delivered", paymentMethod: "COD", shippingAddress: "78, MG Road, Pune", createdAt: "2025-01-05T12:00:00", updatedAt: "2025-01-08T09:30:00", trackingId: "TRK5678901234" },
  { id: "ORD-10005", userId: "u-1", vendorId: "v-6", items: [{ productId: "prod-7", productName: "Dyson V15 Detect", quantity: 1, price: 52900, image: "" }], total: 52900, status: "pending", paymentMethod: "EMI", shippingAddress: "Tech Park, Tower B, Bangalore", createdAt: "2025-02-28T09:20:00", updatedAt: "2025-02-28T09:20:00" },
  { id: "ORD-10006", userId: "u-4", vendorId: "v-5", items: [{ productId: "prod-6", productName: "Levi's 501 Original Fit Jeans", quantity: 2, price: 3499, image: "" }], total: 6998, status: "cancelled", paymentMethod: "UPI", shippingAddress: "15, Connaught Place, Delhi", createdAt: "2025-01-20T14:30:00", updatedAt: "2025-01-21T08:00:00" },
  { id: "ORD-10007", userId: "u-5", vendorId: "v-2", items: [{ productId: "prod-2", productName: "Samsung Galaxy S24 Ultra", quantity: 1, price: 129999, image: "" }], total: 129999, status: "delivered", paymentMethod: "Card", shippingAddress: "78, MG Road, Pune", createdAt: "2024-11-25T11:00:00", updatedAt: "2024-11-30T16:00:00", trackingId: "TRK3456789012" },
  { id: "ORD-10008", userId: "u-1", vendorId: "v-8", items: [{ productId: "prod-9", productName: "L'Oreal Paris Revitalift Serum", quantity: 2, price: 699, image: "" }], total: 1398, status: "shipped", paymentMethod: "UPI", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-02-25T10:00:00", updatedAt: "2025-02-26T15:00:00", trackingId: "TRK7890123456" },
];

export const reviews: Review[] = [
  { id: "r-1", productId: "prod-1", userId: "u-1", userName: "Rahul S.", rating: 5, title: "Best iPhone Ever!", comment: "The camera quality is insane and the titanium build feels premium.", date: "2025-01-02", helpful: 234 },
  { id: "r-2", productId: "prod-1", userId: "u-4", userName: "Anita S.", rating: 4, title: "Great but expensive", comment: "Amazing phone but the price is steep. Camera and performance are top-notch though.", date: "2025-01-15", helpful: 89 },
  { id: "r-3", productId: "prod-4", userId: "u-5", userName: "Vikram J.", rating: 5, title: "Silence is golden", comment: "Best noise canceling headphones I've ever used. The sound quality is phenomenal.", date: "2025-01-20", helpful: 156 },
  { id: "r-4", productId: "prod-5", userId: "u-1", userName: "Rahul S.", rating: 4, title: "Comfortable and stylish", comment: "Great daily wear shoes. Very comfortable for long walks. Sizing is accurate.", date: "2025-02-01", helpful: 45 },
  { id: "r-5", productId: "prod-8", userId: "u-4", userName: "Anita S.", rating: 5, title: "Life-changing book", comment: "A must-read for everyone. The story is beautiful and deeply philosophical.", date: "2024-12-20", helpful: 567 },
  { id: "r-6", productId: "prod-10", userId: "u-5", userName: "Vikram J.", rating: 5, title: "Next-gen gaming", comment: "The loading times are incredible. DualSense controller is a game-changer.", date: "2024-12-10", helpful: 312 },
  { id: "r-7", productId: "prod-2", userId: "u-1", userName: "Rahul S.", rating: 4, title: "Galaxy AI is impressive", comment: "Circle to Search is magical. Battery life is excellent. S Pen is handy.", date: "2025-02-10", helpful: 178 },
  { id: "r-8", productId: "prod-3", userId: "u-4", userName: "Anita S.", rating: 5, title: "Perfect laptop", comment: "Silent, fast, incredible battery life. Best laptop for everyday use.", date: "2025-01-25", helpful: 203 },
];

export const analyticsData = {
  totalRevenue: 256789000,
  totalOrders: 117600,
  totalCustomers: 89450,
  totalVendors: 10,
  monthlyRevenue: [
    { month: "Jul", revenue: 18500000 },
    { month: "Aug", revenue: 21200000 },
    { month: "Sep", revenue: 19800000 },
    { month: "Oct", revenue: 24500000 },
    { month: "Nov", revenue: 31200000 },
    { month: "Dec", revenue: 38900000 },
    { month: "Jan", revenue: 28700000 },
    { month: "Feb", revenue: 22400000 },
  ],
  ordersByStatus: [
    { status: "Delivered", count: 78400 },
    { status: "Shipped", count: 12300 },
    { status: "Confirmed", count: 8900 },
    { status: "Pending", count: 5600 },
    { status: "Cancelled", count: 9200 },
    { status: "Returned", count: 3200 },
  ],
  topCategories: [
    { category: "Electronics", revenue: 98500000 },
    { category: "Fashion", revenue: 45200000 },
    { category: "Home & Living", revenue: 32100000 },
    { category: "Beauty", revenue: 28900000 },
    { category: "Books", revenue: 12300000 },
  ],
};
