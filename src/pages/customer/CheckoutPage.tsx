import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useNotificationStore } from "@/features/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, CreditCard, Banknote, Smartphone, Building2, Check, ChevronLeft, ChevronRight, Tag, X, ShoppingBag, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Pay via Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks supported" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
];

const mockCoupons: Record<string, { discount: number; type: "percent" | "flat"; minOrder: number; label: string; maxDiscount?: number }> = {
  "SAVE10": { discount: 10, type: "percent", minOrder: 1000, label: "10% off", maxDiscount: 2000 },
  "FLAT500": { discount: 500, type: "flat", minOrder: 3000, label: "₹500 off" },
  "WELCOME": { discount: 15, type: "percent", minOrder: 500, label: "15% off (max ₹2000)", maxDiscount: 2000 },
  "FREEBIE": { discount: 200, type: "flat", minOrder: 0, label: "₹200 off" },
};

const STEPS = ["Address", "Payment", "Review"] as const;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, currentUser } = useStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("a-1");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addresses = currentUser?.addresses || [];
  const total = cartTotal();
  const tax = Math.round(total * 0.18);

  let couponDiscount = 0;
  if (appliedCoupon && mockCoupons[appliedCoupon]) {
    const c = mockCoupons[appliedCoupon];
    if (c.type === "percent") {
      couponDiscount = Math.min(Math.round(total * c.discount / 100), c.maxDiscount || 2000);
    } else {
      couponDiscount = c.discount;
    }
  }

  const shipping = total >= 499 ? 0 : 49;
  const grandTotal = total + tax + shipping - couponDiscount;
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  // Vendor groups for order splitting preview
  const vendorGroups = cart.reduce<Record<string, typeof cart>>((g, item) => {
    const key = item.product.vendorId;
    if (!g[key]) g[key] = [];
    g[key].push(item);
    return g;
  }, {});

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
        <h2 className="font-display text-xl font-bold mb-2">No items to checkout</h2>
        <Button asChild><Link to="/products">Shop Now</Link></Button>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = mockCoupons[code];
    if (!coupon) {
      toast({ title: "Invalid coupon", description: "This coupon code is not valid.", variant: "destructive" });
      return;
    }
    if (total < coupon.minOrder) {
      toast({ title: "Minimum order not met", description: `Requires min order of ${formatPrice(coupon.minOrder)}.`, variant: "destructive" });
      return;
    }
    setAppliedCoupon(code);
    toast({ title: "Coupon applied!", description: `${coupon.label} discount applied.` });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePlaceOrder = () => {
    // Simulate order splitting by vendor
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    const vendorOrderCount = Object.keys(vendorGroups).length;

    addNotification({
      type: "order",
      title: "Order Placed Successfully!",
      message: `Order ${orderId} placed with ${vendorOrderCount} vendor${vendorOrderCount > 1 ? "s" : ""}. Total: ${formatPrice(grandTotal)}`,
      actionUrl: "/orders",
    });

    clearCart();
    navigate("/order-success");
  };

  const selectedAddr = addresses.find(a => a.id === selectedAddress);
  const selectedPayment = paymentMethods.find(p => p.id === paymentMethod);

  return (
    <div className="container py-6 max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-1" onClick={() => step > 0 ? setStep(step - 1) : navigate("/cart")}>
        <ChevronLeft className="h-4 w-4" /> {step > 0 ? "Back" : "Back to Cart"}
      </Button>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i < step ? "bg-primary text-primary-foreground" : i === step ? "border-2 border-primary text-primary" : "border-2 border-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-3">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAddress === addr.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                      <RadioGroupItem value={addr.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{addr.name}</span>
                          <Badge variant="outline" className="text-[10px]">{addr.label}</Badge>
                          {addr.isDefault && <Badge className="text-[10px] bg-success/10 text-success border-0">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.line1}, {addr.line2}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-xs text-muted-foreground mt-1">📞 {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
                <Button className="w-full mt-4 gap-2" onClick={() => setStep(1)}>
                  Continue to Payment <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {paymentMethods.map(pm => (
                    <label key={pm.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === pm.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                      <RadioGroupItem value={pm.id} />
                      <pm.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{pm.label}</p>
                        <p className="text-xs text-muted-foreground">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                {paymentMethod === "upi" && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <Label className="text-xs">UPI ID</Label>
                    <Input placeholder="yourname@upi" className="mt-1" />
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-3">
                    <div><Label className="text-xs">Card Number</Label><Input placeholder="1234 5678 9012 3456" className="mt-1" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs">Expiry</Label><Input placeholder="MM/YY" className="mt-1" /></div>
                      <div><Label className="text-xs">CVV</Label><Input placeholder="•••" type="password" className="mt-1" /></div>
                    </div>
                  </div>
                )}

                <Button className="w-full mt-4 gap-2" onClick={() => setStep(2)}>
                  Review Order <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Delivery info */}
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
                    <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={() => setStep(0)}>Change</Button>
                  </div>
                  {selectedAddr && (
                    <p className="text-sm text-muted-foreground">{selectedAddr.name}, {selectedAddr.line1}, {selectedAddr.city} - {selectedAddr.pincode}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment</h3>
                    <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={() => setStep(1)}>Change</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPayment?.label}</p>
                </CardContent>
              </Card>

              {/* Order items grouped by vendor */}
              {Object.entries(vendorGroups).map(([vendorId, items]) => (
                <Card key={vendorId} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{items[0].product.vendorName}</span>
                      <Badge variant="outline" className="text-[10px]">Vendor Order</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button className="w-full gap-2" size="lg" onClick={handlePlaceOrder}>
                <Check className="h-4 w-4" /> Place Order — {formatPrice(grandTotal)}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="shadow-card sticky top-20">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-display font-semibold">Order Summary</h3>
              <Separator />
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1">{item.product.name} × {item.quantity}</span>
                    <span className="ml-2 shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />

              {/* Coupon */}
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="pl-8 text-xs h-9" />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>Apply</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-success/10 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-success" />
                    <span className="text-xs font-medium text-success">{appliedCoupon}</span>
                    <span className="text-xs text-success">(-{formatPrice(couponDiscount)})</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">Try: SAVE10, FLAT500, WELCOME, FREEBIE</p>

              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-success" : ""}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatPrice(tax)}</span></div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-success"><span>Coupon</span><span>-{formatPrice(couponDiscount)}</span></div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              {/* Multi-vendor info */}
              {Object.keys(vendorGroups).length > 1 && (
                <p className="text-[10px] text-muted-foreground bg-muted/50 rounded p-2">
                  📦 This order will be split into {Object.keys(vendorGroups).length} vendor shipments
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
