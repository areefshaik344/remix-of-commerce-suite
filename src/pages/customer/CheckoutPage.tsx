import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, CreditCard, Banknote, Smartphone, Building2, Check, ChevronLeft } from "lucide-react";
import { users } from "@/data/mock-users";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Pay via Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks supported" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, isAuthenticated, login } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState("a-1");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  if (!isAuthenticated) login("customer");

  const customer = users[0];
  const addresses = customer.addresses || [];
  const total = cartTotal();
  const tax = Math.round(total * 0.18);
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-display text-xl font-bold mb-2">No items to checkout</h2>
        <Button asChild><Link to="/products">Shop Now</Link></Button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    clearCart();
    navigate("/order-success");
  };

  return (
    <div className="container py-6">
      <Button variant="ghost" size="sm" className="mb-4 gap-1" onClick={() => navigate("/cart")}>
        <ChevronLeft className="h-4 w-4" /> Back to Cart
      </Button>
      <h1 className="font-display text-xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
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
            </CardContent>
          </Card>

          {/* Payment Method */}
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
                  <div>
                    <Label className="text-xs">Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Expiry</Label><Input placeholder="MM/YY" className="mt-1" /></div>
                    <div><Label className="text-xs">CVV</Label><Input placeholder="•••" type="password" className="mt-1" /></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="shadow-card sticky top-20">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-display font-semibold">Order Summary</h3>
              <Separator />
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1">{item.product.name} × {item.quantity}</span>
                    <span className="ml-2 shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatPrice(tax)}</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total + tax)}</span>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={handlePlaceOrder}>
                <Check className="h-4 w-4" /> Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
