import { type Product, products } from "@/features/product";
import { useCartStore } from "@/features/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Props {
  product: Product;
}

export function FrequentlyBoughtTogether({ product }: Props) {
  const addToCart = useCartStore(s => s.addToCart);
  const { toast } = useToast();

  // Mock: pick 2 products from same category by different vendors
  const suggestions = products
    .filter(p => p.category === product.category && p.id !== product.id && p.inStock)
    .slice(0, 2);

  if (suggestions.length === 0) return null;

  const bundle = [product, ...suggestions];
  const bundleTotal = bundle.reduce((s, p) => s + p.price, 0);
  const bundleDiscount = Math.round(bundleTotal * 0.05);
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  const handleAddBundle = () => {
    bundle.forEach(p => addToCart(p, 1, {}));
    toast({ title: "Bundle added!", description: `${bundle.length} items added to cart.` });
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-sm mb-3">Frequently Bought Together</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {bundle.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              {i > 0 && <Plus className="h-4 w-4 text-muted-foreground shrink-0" />}
              <Link to={`/product/${p.slug}`} className="flex items-center gap-2 group">
                <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-xs line-clamp-2 group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-xs font-medium mt-0.5">{formatPrice(p.price)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div>
            <p className="text-sm font-medium">Bundle Price: <span className="font-display font-bold">{formatPrice(bundleTotal - bundleDiscount)}</span></p>
            <p className="text-xs text-success">Save {formatPrice(bundleDiscount)} (5%)</p>
          </div>
          <Button size="sm" className="gap-1" onClick={handleAddBundle}>
            <ShoppingCart className="h-3.5 w-3.5" /> Add All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
