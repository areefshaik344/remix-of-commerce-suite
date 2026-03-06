import { Product } from "@/data/mock-products";
import { useStore } from "@/store/useStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-border/50 hover:shadow-elevated transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Link to={`/product/${product.slug}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold">
              {product.discount}% OFF
            </Badge>
          )}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-2 right-2 rounded-full bg-card/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
        </div>
        <CardContent className="p-3 space-y-1.5">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-success/10 text-success px-1.5 py-0.5 rounded text-xs font-semibold">
              <span>{product.rating}</span>
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-base">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            className="w-full mt-1 gap-1.5 text-xs"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
