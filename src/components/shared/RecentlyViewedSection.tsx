import { useUIStore } from "@/store/uiStore";
import { products } from "@/features/product";
import { ProductCard } from "@/features/product";
import { Clock } from "lucide-react";

interface RecentlyViewedSectionProps {
  excludeProductIds?: string[];
  maxItems?: number;
  title?: string;
}

export function RecentlyViewedSection({ excludeProductIds = [], maxItems = 6, title = "Recently Viewed" }: RecentlyViewedSectionProps) {
  const recentlyViewed = useUIStore(s => s.recentlyViewed);

  const recentProducts = recentlyViewed
    .filter(id => !excludeProductIds.includes(id))
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, maxItems) as typeof products;

  if (recentProducts.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-display text-lg font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
