import { useParams, Link } from "react-router-dom";
import { products } from "@/data/mock-products";
import { reviews } from "@/data/mock-orders";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shared/ProductCard";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) return <div className="container py-20 text-center text-muted-foreground">Product not found</div>;

  const productReviews = reviews.filter(r => r.productId === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wishlisted = isInWishlist(product.id);
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  return (
    <div className="container py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Link to="/" className="hover:text-foreground">Home</Link> / 
        <Link to="/products" className="hover:text-foreground">Products</Link> / 
        <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">{product.category}</Link> / 
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-muted/30 border">
            <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="font-display text-2xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded text-sm font-semibold">
                <span>{product.rating}</span><Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="text-sm text-muted-foreground">{product.reviewCount.toLocaleString()} ratings</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge className="bg-success text-success-foreground">{product.discount}% off</Badge>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>

          <Separator />

          {/* Variants */}
          {product.variants.map(v => (
            <div key={v.name}>
              <p className="text-sm font-medium mb-2">{v.name}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map(opt => (
                  <Button
                    key={opt}
                    variant={selectedVariants[v.name] === opt ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-3 w-3" /></Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}><Plus className="h-3 w-3" /></Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="flex-1 gap-2" size="lg" onClick={() => addToCart(product, quantity, selectedVariants)}>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={() => toggleWishlist(product.id)} className={wishlisted ? "text-destructive border-destructive/50" : ""}>
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Delivery features */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[{ icon: Truck, label: "Free Delivery" }, { icon: RotateCcw, label: "Easy Returns" }, { icon: ShieldCheck, label: "1 Year Warranty" }].map(f => (
              <div key={f.label} className="text-center p-3 rounded-lg bg-muted/50">
                <f.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Specs */}
          <div>
            <h3 className="font-display font-semibold mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="text-sm">
                  <span className="text-muted-foreground">{k}:</span> <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="font-display text-lg font-bold mb-4">Customer Reviews ({productReviews.length})</h2>
        {productReviews.length > 0 ? (
          <div className="space-y-3">
            {productReviews.map(review => (
              <Card key={review.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-success/10 text-success px-1.5 py-0.5 rounded text-xs font-semibold">
                      {review.rating}<Star className="h-3 w-3 fill-current" />
                    </div>
                    <span className="font-medium text-sm">{review.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{review.userName}</span>
                    <span>{review.date}</span>
                    <button className="flex items-center gap-1 hover:text-foreground"><ThumbsUp className="h-3 w-3" /> {review.helpful}</button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
