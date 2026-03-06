import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const titles: Record<string, string> = {
  "/": "MarketHub - Shop the Best Deals Online",
  "/products": "All Products | MarketHub",
  "/cart": "Shopping Cart | MarketHub",
  "/orders": "My Orders | MarketHub",
  "/vendor": "Vendor Dashboard | MarketHub",
  "/admin": "Admin Dashboard | MarketHub",
};

export default function SEOHead() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "MarketHub - Multi-Vendor Marketplace";
  return null; // SEO is handled via index.html for now
}
