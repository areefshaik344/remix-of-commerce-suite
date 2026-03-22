import { useNavigate, useParams } from "react-router-dom";
import { orders } from "@/features/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Package, MapPin, CreditCard, Clock, RotateCcw } from "lucide-react";
import { users } from "@/features/auth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent-foreground",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  returned: "bg-muted text-muted-foreground",
};

export default function AdminOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const order = orders.find(o => o.id === id);
  const [status, setStatus] = useState(order?.status || "pending");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  if (!order) {
    return <div className="flex items-center justify-center h-64"><div className="text-center"><p className="text-lg font-medium">Order not found</p><Button variant="link" onClick={() => navigate("/admin/orders")}>Back</Button></div></div>;
  }

  const handleStatusUpdate = (s: string) => {
    setStatus(s as any);
    toast({ title: "Status updated", description: `Order ${order.id} → ${s}` });
  };

  const handleRefund = () => {
    const amount = parseFloat(refundAmount);
    if (!amount || amount <= 0 || amount > order.total) {
      toast({ title: "Invalid amount", description: "Enter a valid refund amount.", variant: "destructive" });
      return;
    }
    toast({ title: "Refund processed", description: `₹${amount.toLocaleString("en-IN")} refunded for ${order.id}.` });
    setRefundAmount("");
    setRefundReason("");
  };

  const timeline = [
    { label: "Order Placed", date: order.createdAt, done: true },
    { label: "Confirmed", date: ["confirmed", "shipped", "delivered"].includes(status) ? order.updatedAt : null, done: ["confirmed", "shipped", "delivered"].includes(status) },
    { label: "Shipped", date: ["shipped", "delivered"].includes(status) ? order.updatedAt : null, done: ["shipped", "delivered"].includes(status) },
    { label: "Delivered", date: status === "delivered" ? order.updatedAt : null, done: status === "delivered" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">Order {order.id}</h1>
          <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        <Badge variant="secondary" className={`capitalize ${statusColors[order.status] || ""}`}>{order.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Items</CardTitle></CardHeader>
            <CardContent>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center"><Package className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                  <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total</span><span className="text-lg font-bold">₹{order.total.toLocaleString("en-IN")}</span></div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Timeline</CardTitle></CardHeader>
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
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              {order.trackingId && <div className="text-sm"><span className="text-muted-foreground">Tracking: </span><code className="font-mono text-xs">{order.trackingId}</code></div>}
            </CardContent>
          </Card>

          {/* Refund */}
          <Card className="shadow-card border-destructive/10">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Issue Refund</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Refund Amount (₹)</Label>
                <Input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} placeholder={`Max: ${order.total.toLocaleString("en-IN")}`} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Reason</Label>
                <Textarea value={refundReason} onChange={e => setRefundReason(e.target.value)} placeholder="Reason for refund..." rows={2} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setRefundAmount(order.total.toString()); }}>Full Refund</Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={handleRefund}>Process</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">{order.shippingAddress}</p>
              <p className="text-xs text-muted-foreground mt-2">Customer: {users.find(u => u.id === order.userId)?.name || order.userId}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span>{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">₹{order.total.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate(`/admin/vendors/${order.vendorId}`)}>View →</Button></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
