import { useParams, Link } from "react-router-dom";
import { productApi } from "@/api/productApi";
import { reviewApi } from "@/api/reviewApi";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductCard, PincodeChecker, FrequentlyBoughtTogether, RecentlyViewedSection } from "@/features/product";
import { WriteReviewForm } from "@/components/shared/WriteReviewForm";
import { ProductDetailSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";
import SEOHead from "@/components/shared/SEOHead";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus, ThumbsUp, GitCompareArrows, Store, ZoomIn, Package, AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const addToCart = useCartStore(s => s.addToCart);
  const toggleWishlist = useWishlistStore(s => s.toggleWishlist);
  const isInWishlist = useWishlistStore(s => s.isInWishlist);
  const addToCompare = useUIStore(s => s.addToCompare);
  const isInCompare = useUIStore(s => s.isInCompare);
  const compareList = useUIStore(s => s.compareList);
  const addToRecentlyViewed = useUIStore(s => s.addToRecentlyViewed);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const { data: productResp, isLoading, error, refetch } = useApiQuery(
    () => productApi.getProductBySlug(slug!),
    [slug],
    { enabled: !!slug }
  );

  const product = productResp?.data ?? productResp;

  const { data: reviewsResp } = useApiQuery(
    () => reviewApi.getProductReviews(product?.id),
    [product?.id],
    { enabled: !!product?.id }
  );

  const { data: relatedResp } = useApiQuery(
    () => productApi.getRelatedProducts(product?.id),
    [product?.id],
    { enabled: !!product?.id }
  );

  const productReviews = reviewsResp?.data ?? reviewsResp ?? [];
  const related = relatedResp?.data ?? relatedResp ?? [];

  const jsonLd = useMemo(() => product ? ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0],
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: product.vendorName },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }) : undefined, [product]);

  useEffect(() => {
    if (product) addToRecentlyViewed(product.id);
  }, [product?.id]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <div className="container py-6"><PageError message={error} onRetry={refetch} /></div>;
  if (!product) return <div className="container py-20 text-center text-muted-foreground">Product not found</div>;

  const wishlisted = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;
  const isOutOfStock = !product.inStock || product.stockCount === 0;
  const isLowStock = product.inStock && product.stockCount > 0 && product.stockCount <= 10;

  const deliveryDays = Math.floor(Math.random() * 3) + 2;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  const deliveryStr = deliveryDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="container py-6 space-y-8">
      <SEOHead title={`${product.name} - MarketHub`} description={product.description.slice(0, 160)} jsonLd={jsonLd} />
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Link to="/" className="hover:text-foreground">Home</Link> / 
        <Link to="/products" className="hover:text-foreground">Products</Link> / 
        <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">{product.category}</Link> / 
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images with zoom */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div
            ref={imageRef}
            className="aspect-square rounded-xl overflow-hidden bg-muted/30 border relative group cursor-zoom-in"
            onMouseMove={handleImageHover}
            onClick={() => setZoomOpen(true)}
          >
            <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-70 transition-opacity drop-shadow-lg" />
            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm px-4 py-1">Out of Stock</Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Zoom Dialog */}
        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <div
              className="w-full aspect-square overflow-hidden cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoomPos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full transition-transform duration-100"
                style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(2)" }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3 border-t bg-card">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`h-12 w-12 rounded overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="font-display text-2xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded text-sm font-semibold">
                <span>{product.rating}</span><Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="text-sm text-muted-foreground">{product.reviewCount?.toLocaleString()} ratings</span>
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

          {/* Stock Status */}
          <div className="flex items-center gap-3">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Only {product.stockCount} left — Hurry!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-success">
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">In Stock</span>
              </div>
            )}
          </div>

          {/* Delivery Estimate */}
          {!isOutOfStock && (
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Truck className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Delivery by </span>
                <span className="font-medium">{deliveryStr}</span>
                {product.price >= 499 && <span className="text-success text-xs ml-2">FREE</span>}
              </div>
            </div>
          )}

          <Separator />

          {/* Variants */}
          {product.variants?.map((v: any) => (
            <div key={v.name}>
              <p className="text-sm font-medium mb-2">{v.name}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt: string) => (
                  <Button key={opt} variant={selectedVariants[v.name] === opt ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}>
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
            <Button
              variant="outline" size="lg"
              onClick={() => addToCompare(product.id)}
              disabled={inCompare || compareList.length >= 4}
              className={inCompare ? "text-primary border-primary/50" : ""}
              title={inCompare ? "Already in compare" : compareList.length >= 4 ? "Max 4 products" : "Add to compare"}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
          </div>

          <PincodeChecker />

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
              {Object.entries(product.specs || {}).map(([k, v]) => (
                <div key={k} className="text-sm">
                  <span className="text-muted-foreground">{k}:</span> <span className="font-medium">{String(v)}</span>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Customer Reviews ({(productReviews as any[]).length})</h2>
          <Button variant="outline" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {showReviewForm && (
          <div className="mb-6">
            <WriteReviewForm productId={product.id} onSubmit={() => setShowReviewForm(false)} />
          </div>
        )}

        {(productReviews as any[]).length > 0 ? (
          <div className="space-y-3">
            {(productReviews as any[]).map((review: any) => (
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
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
        )}
      </section>

      {/* Frequently Bought Together */}
      <FrequentlyBoughtTogether product={product} />

      {/* Related */}
      {(related as any[]).length > 0 && (
        <section>
          <h2 className="font-display text-lg font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(related as any[]).map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <RecentlyViewedSection excludeProductIds={[product.id]} maxItems={6} />
    </div>
  );
}
