import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const total = cartTotal();
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Add items to get started</p>
        <Button asChild><Link to="/products">Continue Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="font-display text-xl font-bold mb-4">Shopping Cart ({cart.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item.product.id} layout exit={{ opacity: 0, x: -100 }}>
                <Card className="shadow-card">
                  <CardContent className="p-4 flex gap-4">
                    <Link to={`/product/${item.product.slug}`} className="shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-24 w-24 rounded-lg object-cover" />
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
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-card sticky top-32">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-display font-semibold">Order Summary</h3>
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
