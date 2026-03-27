import { Link } from "react-router-dom";
import { ProductCard, RecentlyViewedSection } from "@/features/product";
import { productApi } from "@/api/productApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, TrendingUp, Star, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/shared/SEOHead";
import { ProductGridSkeleton } from "@/components/shared/ProductSkeleton";
import { InlineError } from "@/components/shared/PageError";
import { Skeleton } from "@/components/ui/skeleton";

const features = [
  { icon: Truck, label: "Free Delivery", sub: "On orders over ₹499" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "100% protected" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day return policy" },
  { icon: Headphones, label: "24/7 Support", sub: "Dedicated support" },
];

const banners = [
  { id: "b1", title: "Electronics Sale", subtitle: "Up to 50% off on top brands", cta: "Shop Now", gradient: "bg-gradient-to-br from-primary to-primary/70" },
  { id: "b2", title: "Fashion Week", subtitle: "New arrivals every day", cta: "Explore", gradient: "bg-gradient-to-br from-accent to-accent/70" },
  { id: "b3", title: "Home & Living", subtitle: "Transform your space", cta: "Discover", gradient: "bg-gradient-to-br from-secondary to-secondary/70" },
];

export default function HomePage() {
  const { data: categories, isLoading: catLoading, error: catError, refetch: refetchCats } = useApiQuery(
    () => productApi.getCategories(),
    []
  );
  const { data: featuredProducts, isLoading: featLoading, error: featError, refetch: refetchFeat } = useApiQuery(
    () => productApi.getFeaturedProducts(),
    []
  );
  const { data: trendingProducts, isLoading: trendLoading, error: trendError, refetch: refetchTrend } = useApiQuery(
    () => productApi.getTrendingProducts(),
    []
  );
  const { data: deals, isLoading: dealsLoading, error: dealsError, refetch: refetchDeals } = useApiQuery(
    () => productApi.getDeals(),
    []
  );

  const catItems = categories?.data ?? categories ?? [];
  const featItems = featuredProducts?.data ?? featuredProducts ?? [];
  const trendItems = trendingProducts?.data ?? trendingProducts ?? [];
  const dealItems = deals?.data ?? deals ?? [];

  return (
    <div className="space-y-8 pb-8">
      <SEOHead title="MarketHub - India's Premier Multi-Vendor Marketplace" description="Shop from 50+ brands across electronics, fashion, beauty, home and more." />

      {/* Hero Banners */}
      <section className="container pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((banner, i) => (
            <motion.div key={banner.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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
              <div className="rounded-lg bg-primary/10 p-2"><f.icon className="h-4 w-4 text-primary" /></div>
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
        {catError ? (
          <InlineError message={catError} onRetry={refetchCats} />
        ) : catLoading ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center"><Skeleton className="h-16 w-16 rounded-2xl mx-auto mb-2" /><Skeleton className="h-3 w-12 mx-auto" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {(catItems as any[]).map((cat: any) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors text-2xl">
                  {cat.icon}
                </div>
                <p className="text-xs font-medium group-hover:text-primary transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
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
        {dealsError ? (
          <InlineError message={dealsError} onRetry={refetchDeals} />
        ) : dealsLoading ? (
          <ProductGridSkeleton count={5} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(dealItems as any[]).slice(0, 5).map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
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
        {featError ? (
          <InlineError message={featError} onRetry={refetchFeat} />
        ) : featLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(featItems as any[]).map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
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
        {trendError ? (
          <InlineError message={trendError} onRetry={refetchTrend} />
        ) : trendLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(trendItems as any[]).map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      <section className="container">
        <RecentlyViewedSection maxItems={6} />
      </section>
    </div>
  );
}
