import { useNavigate } from "react-router-dom";
import { useNotificationStore, type Notification } from "@/store/notificationStore";
import { notificationApi } from "@/api/notificationApi";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Package, Tag, Truck, Star, Shield, Store, CheckCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeIcons: Record<string, typeof Bell> = {
  order: Package,
  promo: Tag,
  delivery: Truck,
  review: Star,
  system: Shield,
  vendor: Store,
  admin: Shield,
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationDropdown() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const unread = unreadCount();

  const handleClick = (n: Notification) => {
    if (!n.read) {
      markAsRead(n.id);
      // Also mark on server (fire-and-forget)
      notificationApi.markAsRead(n.id).catch(() => {});
    }
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    notificationApi.markAllRead().catch(() => {});
  };

  const recent = notifications.slice(0, 8);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {unread > 99 ? "99+" : unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-display font-semibold">Notifications</span>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-normal"
              onClick={(e) => { e.preventDefault(); handleMarkAllRead(); }}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[320px]">
          {recent.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            recent.map((n) => {
              const Icon = typeIcons[n.type] || Bell;
              return (
                <DropdownMenuItem
                  key={n.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
                  onClick={() => handleClick(n)}
                >
                  <div className={`mt-0.5 rounded-full p-1.5 shrink-0 ${!n.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                      {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.timestamp)}</p>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
        {notifications.length > 8 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-sm text-primary justify-center cursor-pointer"
              onClick={() => navigate("/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
