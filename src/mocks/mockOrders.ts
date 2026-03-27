import { Order, OrderStatus } from "@/data/mock-orders";

export const mockOrders: Order[] = [
  { id: "ORD-10001", userId: "u-1", vendorId: "v-1", items: [{ productId: "prod-1", productName: "iPhone 15 Pro Max", quantity: 1, price: 134900, image: "" }], total: 134900, status: "delivered", paymentMethod: "UPI", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2024-12-15T10:30:00", updatedAt: "2024-12-20T14:00:00", trackingId: "TRK9876543210" },
  { id: "ORD-10002", userId: "u-1", vendorId: "v-4", items: [{ productId: "prod-5", productName: "Nike Air Max 270 React", quantity: 2, price: 12995, image: "" }], total: 25990, status: "shipped", paymentMethod: "Card", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-01-10T08:15:00", updatedAt: "2025-01-12T11:00:00", trackingId: "TRK1234567890" },
  { id: "ORD-10003", userId: "u-4", vendorId: "v-3", items: [{ productId: "prod-4", productName: "Sony WH-1000XM5", quantity: 1, price: 26990, image: "" }, { productId: "prod-10", productName: "PlayStation 5 Console", quantity: 1, price: 49990, image: "" }], total: 76980, status: "confirmed", paymentMethod: "Net Banking", shippingAddress: "15, Connaught Place, Delhi", createdAt: "2025-02-01T16:45:00", updatedAt: "2025-02-01T17:00:00" },
  { id: "ORD-10004", userId: "u-5", vendorId: "v-7", items: [{ productId: "prod-8", productName: "The Alchemist", quantity: 3, price: 299, image: "" }], total: 897, status: "delivered", paymentMethod: "COD", shippingAddress: "78, MG Road, Pune", createdAt: "2025-01-05T12:00:00", updatedAt: "2025-01-08T09:30:00", trackingId: "TRK5678901234" },
  { id: "ORD-10005", userId: "u-1", vendorId: "v-6", items: [{ productId: "prod-7", productName: "Dyson V15 Detect", quantity: 1, price: 52900, image: "" }], total: 52900, status: "pending", paymentMethod: "EMI", shippingAddress: "Tech Park, Tower B, Bangalore", createdAt: "2025-02-28T09:20:00", updatedAt: "2025-02-28T09:20:00" },
  { id: "ORD-10006", userId: "u-4", vendorId: "v-5", items: [{ productId: "prod-6", productName: "Levi's 501 Original Fit Jeans", quantity: 2, price: 3499, image: "" }], total: 6998, status: "cancelled", paymentMethod: "UPI", shippingAddress: "15, Connaught Place, Delhi", createdAt: "2025-01-20T14:30:00", updatedAt: "2025-01-21T08:00:00" },
  { id: "ORD-10007", userId: "u-5", vendorId: "v-2", items: [{ productId: "prod-2", productName: "Samsung Galaxy S24 Ultra", quantity: 1, price: 129999, image: "" }], total: 129999, status: "delivered", paymentMethod: "Card", shippingAddress: "78, MG Road, Pune", createdAt: "2024-11-25T11:00:00", updatedAt: "2024-11-30T16:00:00", trackingId: "TRK3456789012" },
  { id: "ORD-10008", userId: "u-1", vendorId: "v-8", items: [{ productId: "prod-9", productName: "L'Oreal Paris Revitalift Serum", quantity: 2, price: 699, image: "" }], total: 1398, status: "shipped", paymentMethod: "UPI", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-02-25T10:00:00", updatedAt: "2025-02-26T15:00:00", trackingId: "TRK7890123456" },
  { id: "ORD-10009", userId: "u-1", vendorId: "v-7", items: [{ productId: "prod-41", productName: "Atomic Habits", quantity: 1, price: 399, image: "" }, { productId: "prod-42", productName: "Sapiens", quantity: 1, price: 499, image: "" }], total: 898, status: "delivered", paymentMethod: "UPI", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-01-15T14:20:00", updatedAt: "2025-01-19T10:00:00", trackingId: "TRK4567890123" },
  { id: "ORD-10010", userId: "u-4", vendorId: "v-1", items: [{ productId: "prod-16", productName: "AirPods Pro 2nd Gen", quantity: 1, price: 24900, image: "" }], total: 24900, status: "delivered", paymentMethod: "Card", shippingAddress: "15, Connaught Place, Delhi", createdAt: "2025-02-05T09:00:00", updatedAt: "2025-02-09T16:30:00", trackingId: "TRK5678901234" },
  { id: "ORD-10011", userId: "u-5", vendorId: "v-8", items: [{ productId: "prod-32", productName: "MAC Ruby Woo Lipstick", quantity: 2, price: 1750, image: "" }, { productId: "prod-34", productName: "The Ordinary Niacinamide", quantity: 3, price: 590, image: "" }], total: 5270, status: "shipped", paymentMethod: "Net Banking", shippingAddress: "78, MG Road, Pune", createdAt: "2025-03-01T11:30:00", updatedAt: "2025-03-03T08:00:00", trackingId: "TRK6789012345" },
  { id: "ORD-10012", userId: "u-1", vendorId: "v-10", items: [{ productId: "prod-20", productName: "Nintendo Switch OLED", quantity: 1, price: 34999, image: "" }], total: 34999, status: "confirmed", paymentMethod: "EMI", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-03-05T15:45:00", updatedAt: "2025-03-05T16:00:00" },
  { id: "ORD-10013", userId: "u-4", vendorId: "v-6", items: [{ productId: "prod-28", productName: "Philips Hue Starter Kit", quantity: 1, price: 12990, image: "" }, { productId: "prod-30", productName: "Prestige Induction Cooktop", quantity: 1, price: 2499, image: "" }], total: 15489, status: "pending", paymentMethod: "UPI", shippingAddress: "15, Connaught Place, Delhi", createdAt: "2025-03-08T10:00:00", updatedAt: "2025-03-08T10:00:00" },
  { id: "ORD-10014", userId: "u-5", vendorId: "v-3", items: [{ productId: "prod-50", productName: "DJI Mini 3 Pro Drone", quantity: 1, price: 74990, image: "" }], total: 74990, status: "shipped", paymentMethod: "Card", shippingAddress: "78, MG Road, Pune", createdAt: "2025-03-02T09:15:00", updatedAt: "2025-03-04T14:00:00", trackingId: "TRK7890123456" },
  { id: "ORD-10015", userId: "u-1", vendorId: "v-9", items: [{ productId: "prod-44", productName: "Whole Organic Almonds", quantity: 2, price: 999, image: "" }, { productId: "prod-46", productName: "Dry Fruits Gift Box", quantity: 1, price: 1499, image: "" }], total: 3497, status: "delivered", paymentMethod: "COD", shippingAddress: "42, Marine Drive Apartments, Mumbai", createdAt: "2025-02-20T08:30:00", updatedAt: "2025-02-23T12:00:00", trackingId: "TRK8901234567" },
];

export const mockAnalyticsData = {
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
