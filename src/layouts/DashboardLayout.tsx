import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useNotificationStore } from "@/features/notification";
import { useNotificationPolling } from "@/hooks/useNotificationPolling";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, LucideIcon, LogOut, User, ChevronDown, LayoutDashboard, Package, DollarSign, Settings, Users, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  title: string;
  navItems: { title: string; url: string; icon: LucideIcon }[];
}

function DashboardSidebar({ title, navItems }: DashboardLayoutProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="pt-4">
        <div className={`px-4 mb-4 ${collapsed ? "text-center" : ""}`}>
          <Link to="/">
            <span className="font-display font-bold text-lg text-gradient">{collapsed ? "M" : title}</span>
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ title, navItems }: DashboardLayoutProps) {
  const { user: currentUser, role: currentRole, logout } = useAuth();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const unread = unreadCount();

  // Poll backend for new notifications every 30s, pause when tab is hidden
  useNotificationPolling({ interval: 30_000, enabled: true });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isVendor = title.includes("Vendor");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar title={title} navItems={navItems} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h2 className="font-display font-semibold text-sm">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                    {unread}
                  </Badge>
                )}
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 pl-2 border-l ml-1">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {currentUser?.name?.[0] || "U"}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-medium leading-none">{currentUser?.name || "User"}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{currentRole}</p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isVendor ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/vendor")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/vendor/products")}>
                        <Package className="mr-2 h-4 w-4" /> Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/vendor/financials")}>
                        <DollarSign className="mr-2 h-4 w-4" /> Financials
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/vendor/settings")}>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                        <Users className="mr-2 h-4 w-4" /> Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/admin/vendors")}>
                        <Store className="mr-2 h-4 w-4" /> Vendors
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    <Store className="mr-2 h-4 w-4" /> Go to Store
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
