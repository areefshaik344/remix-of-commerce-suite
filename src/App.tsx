import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Star, DollarSign, Settings, Users, Store, Tag, BarChart3, FileText, Image } from "lucide-react";

import CustomerLayout from "@/layouts/CustomerLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import HomePage from "@/pages/customer/HomePage";
import ProductsPage from "@/pages/customer/ProductsPage";
import ProductDetailPage from "@/pages/customer/ProductDetailPage";
import CartPage from "@/pages/customer/CartPage";
import OrdersPage from "@/pages/customer/OrdersPage";

import VendorDashboard from "@/pages/vendor/VendorDashboard";
import VendorProducts from "@/pages/vendor/VendorProducts";
import VendorOrders from "@/pages/vendor/VendorOrders";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminVendors from "@/pages/admin/AdminVendors";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const vendorNav = [
  { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
  { title: "Products", url: "/vendor/products", icon: Package },
  { title: "Orders", url: "/vendor/orders", icon: ShoppingCart },
  { title: "Reviews", url: "/vendor/reviews", icon: Star },
  { title: "Financials", url: "/vendor/financials", icon: DollarSign },
  { title: "Settings", url: "/vendor/settings", icon: Settings },
];

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Vendors", url: "/admin/vendors", icon: Store },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Categories", url: "/admin/categories", icon: Tag },
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
          {/* Customer */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Vendor */}
          <Route element={<DashboardLayout title="Vendor Portal" navItems={vendorNav} />}>
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
          </Route>

          {/* Admin */}
          <Route element={<DashboardLayout title="Admin Portal" navItems={adminNav} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
