import { Outlet, Link, useLocation } from "react-router-dom";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";
import { useStore } from "@/store/useStore";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Bell, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  title: string;
  navItems: { title: string; url: string; icon: LucideIcon }[];
}

function DashboardSidebar({ title, navItems }: DashboardLayoutProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

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
  const { currentUser } = useStore();

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
              <RoleSwitcher />
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 pl-2 border-l">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {currentUser?.name?.[0] || "U"}
                </div>
              </div>
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
