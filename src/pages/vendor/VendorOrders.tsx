import { orders } from "@/data/mock-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Order ID</th>
                  <th className="text-left p-3 font-medium">Items</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Payment</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-right p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{order.id}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{order.items.map(i => i.productName).join(", ")}</td>
                    <td className="p-3 text-muted-foreground">{order.userId}</td>
                    <td className="p-3 text-center">
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="text-xs capitalize">{order.status}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{order.paymentMethod}</td>
                    <td className="p-3 text-right font-medium">₹{order.total.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
