import { useStore } from "@/store/useStore";
import { products } from "@/data/mock-products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useStore();
  const compareProducts = compareList.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  if (compareProducts.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-display text-xl font-bold mb-2">No products to compare</h2>
        <p className="text-sm text-muted-foreground mb-4">Add products to compare from the product listing page.</p>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  // Collect all unique spec keys
  const allSpecs = [...new Set(compareProducts.flatMap(p => Object.keys(p.specs)))];

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl font-bold">Compare Products ({compareProducts.length})</h1>
        <Button variant="outline" size="sm" onClick={clearCompare}>Clear All</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground w-32">Feature</th>
              {compareProducts.map(p => (
                <th key={p.id} className="p-3 text-left">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute -top-1 -right-1 rounded-full bg-muted p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <Link to={`/product/${p.slug}`}>
                      <img src={p.images[0]} alt={p.name} className="h-28 w-28 object-cover rounded-lg mb-2" />
                    </Link>
                    <Link to={`/product/${p.slug}`} className="text-sm font-medium hover:text-primary line-clamp-2">
                      {p.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 text-sm text-muted-foreground">Price</td>
              {compareProducts.map(p => (
                <td key={p.id} className="p-3">
                  <span className="font-display font-bold">{formatPrice(p.price)}</span>
                  {p.discount > 0 && <Badge className="ml-2 bg-success text-success-foreground text-[10px]">{p.discount}% off</Badge>}
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 text-sm text-muted-foreground">Rating</td>
              {compareProducts.map(p => (
                <td key={p.id} className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold">{p.rating}</span>
                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                    <span className="text-xs text-muted-foreground">({p.reviewCount.toLocaleString()})</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 text-sm text-muted-foreground">Brand</td>
              {compareProducts.map(p => <td key={p.id} className="p-3 text-sm">{p.brand}</td>)}
            </tr>
            <tr className="border-t">
              <td className="p-3 text-sm text-muted-foreground">Seller</td>
              {compareProducts.map(p => <td key={p.id} className="p-3 text-sm">{p.vendorName}</td>)}
            </tr>
            {allSpecs.map(spec => (
              <tr key={spec} className="border-t">
                <td className="p-3 text-sm text-muted-foreground">{spec}</td>
                {compareProducts.map(p => (
                  <td key={p.id} className="p-3 text-sm">{p.specs[spec] || "—"}</td>
                ))}
              </tr>
            ))}
            <tr className="border-t">
              <td className="p-3" />
              {compareProducts.map(p => (
                <td key={p.id} className="p-3">
                  <Button size="sm" className="gap-1 w-full" onClick={() => addToCart(p)}>
                    <ShoppingCart className="h-3 w-3" /> Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
