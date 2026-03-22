import { Link } from "react-router-dom";
import { ProductCard, RecentlyViewedSection, categories, banners, featuredProducts, trendingProducts, deals } from "@/features/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, TrendingUp, Star, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/shared/SEOHead";

const features = [
  { icon: Truck, label: "Free Delivery", sub: "On orders over ₹499" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "100% protected" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day return policy" },
  { icon: Headphones, label: "24/7 Support", sub: "Dedicated support" },
];

export default function HomePage() {
  return (
    <div className="space-y-8 pb-8">
      <SEOHead title="MarketHub - India's Premier Multi-Vendor Marketplace" description="Shop from 50+ brands across electronics, fashion, beauty, home and more." />
      {/* Hero Banners */}
      <section className="container pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`${banner.gradient} text-primary-foreground border-0 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}>
                <CardContent className="p-6 space-y-2">
                  <h2 className="font-display text-xl font-bold">{banner.title}</h2>
                  <p className="text-sm opacity-90">{banner.subtitle}</p>
                  <Button size="sm" variant="secondary" className="mt-2 text-xs">{banner.cta} <ArrowRight className="h-3 w-3 ml-1" /></Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map(f => (
            <div key={f.label} className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
              <div className="rounded-lg bg-primary/10 p-2">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Shop by Category</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors text-2xl">
                {cat.icon}
              </div>
              <p className="text-xs font-medium group-hover:text-primary transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />
            <h2 className="font-display text-lg font-bold">Deals of the Day</h2>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {deals.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Featured */}
      <section className="container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-secondary" />
            <h2 className="font-display text-lg font-bold">Featured Products</h2>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Trending */}
      <section className="container">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <h2 className="font-display text-lg font-bold">Trending Now</h2>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {trendingProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="container">
        <RecentlyViewedSection maxItems={6} />
      </section>
    </div>
  );
}
