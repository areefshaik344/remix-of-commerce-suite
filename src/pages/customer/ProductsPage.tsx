import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories } from "@/data/mock-products";
import { ProductCard } from "@/components/shared/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SlidersHorizontal } from "lucide-react";

const brands = [...new Set(products.map(p => p.brand))];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get("category") || "";
  const querySearch = searchParams.get("q") || "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(queryCategory ? [queryCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      if (querySearch && !p.name.toLowerCase().includes(querySearch.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"))) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "discount": result.sort((a, b) => b.discount - a.discount); break;
      case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
    }
    return result;
  }, [querySearch, selectedCategories, selectedBrands, priceRange, minRating, sortBy]);

  const toggleCategory = (slug: string) => setSelectedCategories(prev => prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]);
  const toggleBrand = (brand: string) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const clearAll = () => { setSelectedCategories([]); setSelectedBrands([]); setPriceRange([0, 200000]); setMinRating(0); };
  const activeFilters = selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0);

  const filterProps = {
    selectedCategories, selectedBrands, priceRange, minRating, brands,
    onToggleCategory: toggleCategory, onToggleBrand: toggleBrand,
    onPriceChange: setPriceRange, onRatingChange: setMinRating, onClearAll: clearAll,
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-bold">
            {querySearch ? `Results for "${querySearch}"` : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilters > 0 && <Badge className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px]">{activeFilters}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-4"><FilterPanel {...filterProps} /></div>
              </SheetContent>
            </Sheet>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 text-xs"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="discount">Discount</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-32 rounded-lg border bg-card p-4">
            <FilterPanel {...filterProps} />
          </div>
        </aside>
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
