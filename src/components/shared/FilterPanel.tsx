import { categories } from "@/features/product";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: number[];
  minRating: number;
  brands: string[];
  onToggleCategory: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onPriceChange: (range: number[]) => void;
  onRatingChange: (rating: number) => void;
  onClearAll: () => void;
}

const ratings = [4, 3, 2, 1];

export function FilterPanel({
  selectedCategories, selectedBrands, priceRange, minRating, brands,
  onToggleCategory, onToggleBrand, onPriceChange, onRatingChange, onClearAll,
}: FilterPanelProps) {
  const activeFilters = selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedCategories.includes(cat.slug)} onCheckedChange={() => onToggleCategory(cat.slug)} />
              <span>{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Brand</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedBrands.includes(brand)} onCheckedChange={() => onToggleBrand(brand)} />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-3">Price Range</h4>
        <Slider value={priceRange} onValueChange={onPriceChange} min={0} max={200000} step={1000} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-2">Rating</h4>
        <div className="space-y-2">
          {ratings.map(r => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={minRating === r} onCheckedChange={() => onRatingChange(minRating === r ? 0 : r)} />
              <span>{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>
      {activeFilters > 0 && (
        <Button variant="outline" size="sm" className="w-full" onClick={onClearAll}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
