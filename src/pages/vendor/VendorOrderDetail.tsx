import { useNavigate, useParams } from "react-router-dom";
import { orders } from "@/data/mock-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent-foreground",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function VendorOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const order = orders.find(o => o.id === id);
  const [status, setStatus] = useState(order?.status || "pending");

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium">Order not found</p>
          <Button variant="link" onClick={() => navigate("/vendor/orders")}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus as any);
    toast({ title: "Status updated", description: `Order ${order.id} marked as ${newStatus}` });
  };

  const timeline = [
    { label: "Order Placed", date: order.createdAt, done: true },
    { label: "Confirmed", date: status !== "pending" ? order.updatedAt : null, done: ["confirmed", "shipped", "delivered"].includes(status) },
    { label: "Shipped", date: status === "shipped" || status === "delivered" ? order.updatedAt : null, done: ["shipped", "delivered"].includes(status) },
    { label: "Delivered", date: status === "delivered" ? order.updatedAt : null, done: status === "delivered" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/orders")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">Order {order.id}</h1>
          <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        <Badge variant="secondary" className={`capitalize ${statusColors[order.status] || ""}`}>{order.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Order Items</CardTitle></CardHeader>
            <CardContent>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center"><Package className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-lg font-bold">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Order Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${step.done ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      {i < timeline.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${step.done ? "bg-primary" : "bg-muted-foreground/20"}`} />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${step.done ? "" : "text-muted-foreground"}`}>{step.label}</p>
                      {step.date && <p className="text-xs text-muted-foreground">{new Date(step.date).toLocaleString("en-IN")}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Update Status */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={status} onValueChange={handleStatusUpdate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {order.trackingId && (
                <div className="text-sm"><span className="text-muted-foreground">Tracking: </span><code className="font-mono">{order.trackingId}</code></div>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Method</span><span>{order.paymentMethod}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-medium">₹{order.total.toLocaleString("en-IN")}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
