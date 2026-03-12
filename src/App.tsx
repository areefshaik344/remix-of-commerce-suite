import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Star, DollarSign, Settings, Users, Store, Tag, BarChart3, Image, Ticket, Truck, Archive, ClipboardCheck, Percent, ShieldAlert, FileBarChart } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CustomerLayout from "@/layouts/CustomerLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import VendorRegisterPage from "@/pages/auth/VendorRegisterPage";
import VendorRegisterSuccessPage from "@/pages/auth/VendorRegisterSuccessPage";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";

// Customer pages
import HomePage from "@/pages/customer/HomePage";
import ProductsPage from "@/pages/customer/ProductsPage";
import ProductDetailPage from "@/pages/customer/ProductDetailPage";
import CartPage from "@/pages/customer/CartPage";
import CheckoutPage from "@/pages/customer/CheckoutPage";
import OrderSuccessPage from "@/pages/customer/OrderSuccessPage";
import OrdersPage from "@/pages/customer/OrdersPage";
import OrderDetailPage from "@/pages/customer/OrderDetailPage";
import WishlistPage from "@/pages/customer/WishlistPage";
import ProfilePage from "@/pages/customer/ProfilePage";
import NotificationsPage from "@/pages/customer/NotificationsPage";
import VendorStorePage from "@/pages/customer/VendorStorePage";
import ComparePage from "@/pages/customer/ComparePage";

// Vendor pages
import VendorDashboard from "@/pages/vendor/VendorDashboard";
import VendorProducts from "@/pages/vendor/VendorProducts";
import VendorProductForm from "@/pages/vendor/VendorProductForm";
import VendorProductEdit from "@/pages/vendor/VendorProductEdit";
import VendorOrders from "@/pages/vendor/VendorOrders";
import VendorOrderDetail from "@/pages/vendor/VendorOrderDetail";
import VendorReviews from "@/pages/vendor/VendorReviews";
import VendorFinancials from "@/pages/vendor/VendorFinancials";
import VendorPayoutHistory from "@/pages/vendor/VendorPayoutHistory";
import VendorSettings from "@/pages/vendor/VendorSettings";
import VendorCoupons from "@/pages/vendor/VendorCoupons";
import VendorCreateCoupon from "@/pages/vendor/VendorCreateCoupon";
import VendorOnboarding from "@/pages/vendor/VendorOnboarding";
import VendorInventory from "@/pages/vendor/VendorInventory";
import VendorLowStockAlerts from "@/pages/vendor/VendorLowStockAlerts";
import VendorShipping from "@/pages/vendor/VendorShipping";
import VendorAnalytics from "@/pages/vendor/VendorAnalytics";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminVendors from "@/pages/admin/AdminVendors";
import AdminVendorDetail from "@/pages/admin/AdminVendorDetail";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProductDetail from "@/pages/admin/AdminProductDetail";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminOrderDetail from "@/pages/admin/AdminOrderDetail";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminCMS from "@/pages/admin/AdminCMS";
import AdminBannerForm from "@/pages/admin/AdminBannerForm";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminCreateCoupon from "@/pages/admin/AdminCreateCoupon";
import AdminCommission from "@/pages/admin/AdminCommission";
import AdminFraud from "@/pages/admin/AdminFraud";
import AdminReporting from "@/pages/admin/AdminReporting";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const vendorNav = [
  { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
  { title: "Products", url: "/vendor/products", icon: Package },
  { title: "Inventory", url: "/vendor/inventory", icon: Archive },
  { title: "Orders", url: "/vendor/orders", icon: ShoppingCart },
  { title: "Shipping", url: "/vendor/shipping", icon: Truck },
  { title: "Coupons", url: "/vendor/coupons", icon: Tag },
  { title: "Reviews", url: "/vendor/reviews", icon: Star },
  { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
  { title: "Financials", url: "/vendor/financials", icon: DollarSign },
  { title: "Onboarding", url: "/vendor/onboarding", icon: ClipboardCheck },
  { title: "Settings", url: "/vendor/settings", icon: Settings },
];

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Vendors", url: "/admin/vendors", icon: Store },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Categories", url: "/admin/categories", icon: Tag },
  { title: "Commission", url: "/admin/commission", icon: Percent },
  { title: "Coupons", url: "/admin/coupons", icon: Ticket },
  { title: "Fraud", url: "/admin/fraud", icon: ShieldAlert },
  { title: "Reporting", url: "/admin/reporting", icon: FileBarChart },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "CMS", url: "/admin/cms", icon: Image },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth - public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/vendor/register" element={<VendorRegisterPage />} />
          <Route path="/vendor/register/success" element={<VendorRegisterSuccessPage />} />

          {/* Customer - public browsing, auth for checkout/profile */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/store/:vendorSlug" element={<VendorStorePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={["customer"]}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute allowedRoles={["customer"]}><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={["customer"]}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={["customer"]}><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["customer"]}><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute allowedRoles={["customer"]}><NotificationsPage /></ProtectedRoute>} />
          </Route>

          {/* Vendor - protected */}
          <Route element={
            <ProtectedRoute allowedRoles={["vendor", "admin"]}>
              <DashboardLayout title="Vendor Portal" navItems={vendorNav} />
            </ProtectedRoute>
          }>
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/products/new" element={<VendorProductForm />} />
            <Route path="/vendor/products/:id/edit" element={<VendorProductEdit />} />
            <Route path="/vendor/inventory" element={<VendorInventory />} />
            <Route path="/vendor/inventory/low-stock" element={<VendorLowStockAlerts />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/orders/:id" element={<VendorOrderDetail />} />
            <Route path="/vendor/shipping" element={<VendorShipping />} />
            <Route path="/vendor/reviews" element={<VendorReviews />} />
            <Route path="/vendor/analytics" element={<VendorAnalytics />} />
            <Route path="/vendor/coupons" element={<VendorCoupons />} />
            <Route path="/vendor/coupons/new" element={<VendorCreateCoupon />} />
            <Route path="/vendor/financials" element={<VendorFinancials />} />
            <Route path="/vendor/financials/payouts" element={<VendorPayoutHistory />} />
            <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
            <Route path="/vendor/settings" element={<VendorSettings />} />
          </Route>

          {/* Admin - protected */}
          <Route element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout title="Admin Portal" navItems={adminNav} />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/vendors/:id" element={<AdminVendorDetail />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/:id" element={<AdminProductDetail />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/commission" element={<AdminCommission />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/coupons/new" element={<AdminCreateCoupon />} />
            <Route path="/admin/fraud" element={<AdminFraud />} />
            <Route path="/admin/reporting" element={<AdminReporting />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/cms" element={<AdminCMS />} />
            <Route path="/admin/cms/banners/new" element={<AdminBannerForm />} />
            <Route path="/admin/cms/banners/:id/edit" element={<AdminBannerForm />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
