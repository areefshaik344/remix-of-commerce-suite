import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Bookmark, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RecentlyViewedSection } from "@/components/shared/RecentlyViewedSection";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart, savedForLater, saveForLater, moveToCart, removeSaved, recentlyViewed } = useStore();
  const navigate = useNavigate();
  const total = cartTotal();
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  // Group cart items by vendor
  const vendorGroups = cart.reduce<Record<string, typeof cart>>((groups, item) => {
    const key = item.product.vendorId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  const recentProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .filter(p => !cart.some(i => i.product.id === p!.id))
    .slice(0, 4) as typeof products;

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Add items to get started</p>
        <Button asChild><Link to="/products">Continue Shopping</Link></Button>

        {recentProducts.length > 0 && (
          <div className="mt-12 text-left">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Recently Viewed
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="font-display text-xl font-bold mb-4">Shopping Cart ({cart.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Vendor-grouped cart items */}
          <AnimatePresence>
            {Object.entries(vendorGroups).map(([vendorId, items]) => {
              const vendorName = items[0].product.vendorName;
              const vendorSubtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

              return (
                <motion.div key={vendorId} layout exit={{ opacity: 0, x: -100 }}>
                  <Card className="shadow-card overflow-hidden">
                    {/* Vendor header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b">
                      <div className="flex items-center gap-2 text-sm">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{vendorName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Subtotal: {formatPrice(vendorSubtotal)}</span>
                    </div>

                    <CardContent className="p-0 divide-y">
                      {items.map(item => (
                        <div key={item.product.id} className="flex gap-4 p-4">
                          <Link to={`/product/${item.product.slug}`} className="shrink-0">
                            <img src={item.product.images[0]} alt={item.product.name} className="h-24 w-24 rounded-lg object-cover" loading="lazy" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.product.slug}`}>
                              <h3 className="font-medium text-sm line-clamp-1 hover:text-primary">{item.product.name}</h3>
                            </Link>
                            <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                            {Object.entries(item.selectedVariants).length > 0 && (
                              <div className="flex gap-2 mt-1">
                                {Object.entries(item.selectedVariants).map(([k, v]) => (
                                  <span key={k} className="text-xs bg-muted px-2 py-0.5 rounded">{k}: {v}</span>
                                ))}
                              </div>
                            )}

                            {/* Stock indicator */}
                            {item.product.stockCount <= 5 && item.product.inStock && (
                              <p className="text-xs text-destructive mt-1">Only {item.product.stockCount} left!</p>
                            )}
                            {!item.product.inStock && (
                              <Badge variant="destructive" className="text-[10px] mt-1">Out of Stock</Badge>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                                {item.quantity > 1 && <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)} each</p>}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => saveForLater(item.product.id)} title="Save for later">
                              <Bookmark className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Saved for Later */}
          {savedForLater.length > 0 && (
            <div className="pt-4">
              <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                <Bookmark className="h-4 w-4" /> Saved for Later ({savedForLater.length})
              </h2>
              <div className="space-y-2">
                {savedForLater.map(item => (
                  <Card key={item.product.id} className="shadow-card">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Link to={`/product/${item.product.slug}`} className="shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product.slug}`}>
                          <h3 className="font-medium text-sm line-clamp-1 hover:text-primary">{item.product.name}</h3>
                        </Link>
                        <p className="font-display font-bold text-sm mt-1">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => moveToCart(item.product.id)}>Move to Cart</Button>
                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => removeSaved(item.product.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-card sticky top-32">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-display font-semibold">Order Summary</h3>
              <Separator />

              {/* Per-vendor breakdown */}
              {Object.entries(vendorGroups).map(([vendorId, items]) => {
                const sub = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
                return (
                  <div key={vendorId} className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate">{items[0].product.vendorName}</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                );
              })}

              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (est.)</span><span>{formatPrice(Math.round(total * 0.18))}</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(Math.round(total * 1.18))}</span>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={() => navigate("/checkout")}>
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={clearCart}>
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
