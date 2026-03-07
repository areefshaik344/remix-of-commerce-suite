import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, Tag, Star, Truck, CheckCircle } from "lucide-react";

const notifications = [
  { id: "1", type: "order", icon: Package, title: "Order Shipped", message: "Your order #ORD-001 has been shipped and will arrive by Jan 20", time: "2 hours ago", read: false },
  { id: "2", type: "promo", icon: Tag, title: "Flash Sale! 50% Off Electronics", message: "Limited time offer on top electronics brands. Shop now!", time: "5 hours ago", read: false },
  { id: "3", type: "delivery", icon: Truck, title: "Out for Delivery", message: "Your order #ORD-003 is out for delivery today", time: "1 day ago", read: true },
  { id: "4", type: "review", icon: Star, title: "Rate Your Purchase", message: "How was your Sony WH-1000XM5? Leave a review!", time: "2 days ago", read: true },
  { id: "5", type: "order", icon: CheckCircle, title: "Order Delivered", message: "Your order #ORD-005 has been delivered successfully", time: "3 days ago", read: true },
  { id: "6", type: "promo", icon: Tag, title: "New Arrivals in Fashion", message: "Check out the latest spring collection from top brands", time: "4 days ago", read: true },
];

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="container py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread</p>
        </div>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>

      <div className="space-y-2">
        {notifications.map(n => (
          <Card key={n.id} className={!n.read ? "border-primary/30 bg-primary/5" : ""}>
            <CardContent className="flex items-start gap-3 py-3 px-4">
              <div className={`mt-0.5 p-2 rounded-full ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{n.title}</p>
                  {!n.read && <Badge className="h-4 text-[10px]">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
