import { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { products } from "@/features/product";
import { Search, X, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TRENDING_SEARCHES = ["iPhone 15", "Nike shoes", "PlayStation 5", "MacBook", "Samsung Galaxy", "Headphones"];

export function SearchBar() {
  const searchQuery = useUIStore(s => s.searchQuery);
  const setSearchQuery = useUIStore(s => s.setSearchQuery);
  const searchHistory = useUIStore(s => s.searchHistory);
  const addToSearchHistory = useUIStore(s => s.addToSearchHistory);
  const clearSearchHistory = useUIStore(s => s.clearSearchHistory);
  const [focused, setFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = localQuery.length >= 2
    ? products.filter(p => p.name.toLowerCase().includes(localQuery.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    addToSearchHistory(localQuery.trim());
    setSearchQuery(localQuery);
    setFocused(false);
    navigate(`/products?q=${encodeURIComponent(localQuery)}`);
  };

  const handleQuickSearch = (query: string) => {
    setLocalQuery(query);
    addToSearchHistory(query);
    setSearchQuery(query);
    setFocused(false);
    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  const showDropdown = focused && localQuery.length < 2;
  const showSuggestions = focused && suggestions.length > 0;

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localQuery}
          onChange={e => { setLocalQuery(e.target.value); setFocused(true); }}
          onFocus={() => setFocused(true)}
          placeholder="Search products, brands, categories..."
          className="pl-10 pr-8 bg-card border-border"
        />
        {localQuery && (
          <button type="button" onClick={() => { setLocalQuery(""); setSearchQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </form>

      {/* Search history & trending when no query */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-card shadow-elevated overflow-hidden">
          {searchHistory.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Recent Searches
                </span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px] text-muted-foreground hover:text-destructive" onClick={clearSearchHistory}>
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {searchHistory.slice(0, 6).map(q => (
                  <button
                    key={q}
                    onClick={() => handleQuickSearch(q)}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-3 border-t">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
              <TrendingUp className="h-3 w-3" /> Trending Searches
            </span>
            <div className="space-y-0.5">
              {TRENDING_SEARCHES.map(q => (
                <button
                  key={q}
                  onClick={() => handleQuickSearch(q)}
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-muted rounded transition-colors"
                >
                  <TrendingUp className="h-3 w-3 text-secondary shrink-0" />
                  <span>{q}</span>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product suggestions when typing */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-card shadow-elevated overflow-hidden">
          {suggestions.map(p => (
            <button
              key={p.id}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
              onClick={() => { setLocalQuery(p.name); addToSearchHistory(p.name); setSearchQuery(p.name); setFocused(false); navigate(`/product/${p.slug}`); }}
            >
              <img src={p.images[0]} alt="" className="h-8 w-8 rounded object-cover shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <span className="truncate block">{p.name}</span>
                <span className="text-xs text-muted-foreground">₹{p.price.toLocaleString("en-IN")}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{p.category}</span>
            </button>
          ))}
          <button
            className="flex w-full items-center justify-center gap-1 px-4 py-2 text-xs text-primary hover:bg-muted transition-colors border-t"
            onClick={handleSubmit as any}
          >
            <Search className="h-3 w-3" /> See all results for "{localQuery}"
          </button>
        </div>
      )}
    </div>
  );
}
