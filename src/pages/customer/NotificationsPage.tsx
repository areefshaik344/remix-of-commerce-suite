import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Package, Tag, Star, Truck, CheckCircle, Shield, Store, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "@/api/notificationApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";

type NotificationType = "order" | "promo" | "delivery" | "review" | "system" | "vendor" | "admin";

const iconMap: Record<NotificationType, typeof Bell> = {
  order: Package,
  promo: Tag,
  delivery: Truck,
  review: Star,
  system: Shield,
  vendor: Store,
  admin: CheckCircle,
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useApiQuery(
    () => notificationApi.getNotifications(),
    []
  );

  const notifications: any[] = data?.items || data || [];
  const unread = notifications.filter((n: any) => !n.read).length;

  const handleClick = async (n: any) => {
    if (!n.read) {
      try { await notificationApi.markAsRead(n.id); } catch {}
    }
    if (n.actionUrl) navigate(n.actionUrl);
    refetch();
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      refetch();
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="container py-6 max-w-2xl space-y-2">
        <Skeleton className="h-8 w-48 mb-4" />
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  if (error) return <div className="container py-6 max-w-2xl"><PageError message={error} onRetry={refetch} /></div>;

  return (
    <div className="container py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>Mark all as read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => {
            const Icon = iconMap[n.type as NotificationType] || Bell;
            return (
              <Card
                key={n.id}
                className={`cursor-pointer transition-colors ${!n.read ? "border-primary/30 bg-primary/5" : "hover:bg-muted/30"}`}
                onClick={() => handleClick(n)}
              >
                <CardContent className="flex items-start gap-3 py-3 px-4">
                  <div className={`mt-0.5 p-2 rounded-full shrink-0 ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{n.title}</p>
                      {!n.read && <Badge className="h-4 text-[10px]">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.timestamp || n.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
