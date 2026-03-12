import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { orders } from "@/data/mock-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Truck, CheckCircle2, Clock, ChevronLeft, MapPin, CreditCard, RotateCcw, Download, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const timelineSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const statusOrder = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const order = orders.find(o => o.id === id);
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnType, setReturnType] = useState("return");

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-display text-xl font-bold mb-2">Order not found</h2>
        <Button asChild><Link to="/orders">Back to Orders</Link></Button>
      </div>
    );
  }

  const currentStep = statusOrder.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const isReturned = order.status === "returned";
  const canReturn = order.status === "delivered";
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  const handleReturnSubmit = () => {
    setReturnOpen(false);
    toast({ title: "Request submitted", description: `Your ${returnType} request has been submitted. We'll process it within 2-3 business days.` });
  };

  const handleDownloadInvoice = () => {
    // Generate a simple invoice text file as mock
    const invoiceContent = `
═══════════════════════════════════════
          MARKETHUB - TAX INVOICE
═══════════════════════════════════════

Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
Status: ${order.status.toUpperCase()}

───────────────────────────────────────
ITEMS
───────────────────────────────────────
${order.items.map(item => `${item.productName}
  Qty: ${item.quantity}  |  Price: ${formatPrice(item.price)}  |  Total: ${formatPrice(item.price * item.quantity)}`).join("\n\n")}

───────────────────────────────────────
Subtotal:     ${formatPrice(order.total)}
GST (18%):    ${formatPrice(Math.round(order.total * 0.18))}
Shipping:     FREE
───────────────────────────────────────
TOTAL:        ${formatPrice(order.total + Math.round(order.total * 0.18))}
───────────────────────────────────────

Payment: ${order.paymentMethod}
Shipping: ${order.shippingAddress}
${order.trackingId ? `Tracking: ${order.trackingId}` : ""}

Thank you for shopping with MarketHub!
    `.trim();

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Invoice downloaded" });
  };

  return (
    <div className="container py-6 max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4 gap-1" asChild>
        <Link to="/orders"><ChevronLeft className="h-4 w-4" /> Back to Orders</Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold">{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleDownloadInvoice}>
            <Download className="h-3 w-3" /> Invoice
          </Button>
          {canReturn && (
            <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10">
                  <RotateCcw className="h-3 w-3" /> Return / Refund
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Return / Refund</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="text-xs">Request Type</Label>
                    <Select value={returnType} onValueChange={setReturnType}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="return">Return & Refund</SelectItem>
                        <SelectItem value="replace">Replacement</SelectItem>
                        <SelectItem value="refund">Refund Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Reason</Label>
                    <Select value={returnReason} onValueChange={setReturnReason}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select a reason" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defective">Product is defective</SelectItem>
                        <SelectItem value="wrong">Wrong item delivered</SelectItem>
                        <SelectItem value="not-as-described">Not as described</SelectItem>
                        <SelectItem value="size">Size/fit issue</SelectItem>
                        <SelectItem value="changed-mind">Changed my mind</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Additional Details</Label>
                    <Textarea placeholder="Describe the issue..." className="mt-1" rows={3} />
                  </div>
                  <Button className="w-full" onClick={handleReturnSubmit} disabled={!returnReason}>
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Order Tracking Timeline */}
      {!isCancelled && !isReturned && (
        <Card className="shadow-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(currentStep / (timelineSteps.length - 1)) * 100}%` }}
                />
              </div>
              {timelineSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-primary mt-0.5">
                        {new Date(order.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {order.trackingId && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Tracking ID: <span className="font-mono font-medium text-foreground">{order.trackingId}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {isCancelled && (
        <Card className="shadow-card mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-sm">Order Cancelled</p>
              <p className="text-xs text-muted-foreground">This order was cancelled on {new Date(order.updatedAt).toLocaleDateString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-display font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-display font-semibold text-sm">Order Summary</h3>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatPrice(Math.round(order.total * 0.18))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-display font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total + Math.round(order.total * 0.18))}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Payment:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Delivery: </span>
                  <span className="font-medium">{order.shippingAddress}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
