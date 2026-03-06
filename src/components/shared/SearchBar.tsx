import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { products } from "@/data/mock-products";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useStore();
  const [focused, setFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = localQuery.length >= 2
    ? products.filter(p => p.name.toLowerCase().includes(localQuery.toLowerCase())).slice(0, 5)
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
    setSearchQuery(localQuery);
    setFocused(false);
    navigate(`/products?q=${encodeURIComponent(localQuery)}`);
  };

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
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-card shadow-elevated overflow-hidden">
          {suggestions.map(p => (
            <button
              key={p.id}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
              onClick={() => { setLocalQuery(p.name); setSearchQuery(p.name); setFocused(false); navigate(`/product/${p.slug}`); }}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{p.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{p.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
