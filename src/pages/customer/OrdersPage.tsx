import { orderApi } from "@/api/orderApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { TableSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: "bg-warning/10 text-warning", icon: Clock },
  confirmed: { color: "bg-primary/10 text-primary", icon: Package },
  shipped: { color: "bg-primary/10 text-primary", icon: Truck },
  delivered: { color: "bg-success/10 text-success", icon: CheckCircle2 },
  cancelled: { color: "bg-destructive/10 text-destructive", icon: XCircle },
  returned: { color: "bg-muted text-muted-foreground", icon: RotateCcw },
};

export default function OrdersPage() {
  const { data: ordersResp, isLoading, error, refetch } = useApiQuery(
    () => orderApi.getOrders(),
    []
  );

  const orders = ordersResp?.data ?? ordersResp ?? [];

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="font-display text-xl font-bold mb-4">My Orders</h1>
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <h1 className="font-display text-xl font-bold mb-4">My Orders</h1>
        <PageError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="font-display text-xl font-bold mb-4">My Orders</h1>
      {(orders as any[]).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(orders as any[]).map((order: any) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <Badge className={`${config.color} border-0 gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        <span>{order.paymentMethod}</span>
                        {order.trackingId && <span className="ml-3">Tracking: {order.trackingId}</span>}
                      </div>
                      <span className="font-display font-bold">₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
