import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsData } from "@/data/mock-orders";
import { vendors } from "@/data/mock-users";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Store, ShoppingCart, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  const revenueData = analyticsData.monthlyRevenue.map(d => ({ ...d, revenue: d.revenue / 100000 }));
  const categoryData = analyticsData.topCategories.map(d => ({ ...d, revenue: d.revenue / 100000 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide metrics and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹25.7Cr" change="+15.3% vs last quarter" changeType="positive" icon={DollarSign} iconClassName="bg-success/10 text-success" />
        <StatCard title="Total Orders" value="1,17,600" change="+9.8% this month" changeType="positive" icon={ShoppingCart} iconClassName="bg-primary/10 text-primary" />
        <StatCard title="Customers" value="89,450" change="+2,340 new this month" changeType="positive" icon={Users} iconClassName="bg-accent/10 text-accent" />
        <StatCard title="Active Vendors" value={String(vendors.filter(v => v.status === "active").length)} change="1 pending approval" changeType="neutral" icon={Store} iconClassName="bg-secondary/10 text-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Revenue Trend (₹ Lakhs)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Revenue by Category (₹ Lakhs)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis type="category" dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={80} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Vendors Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Store</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Products</th>
                  <th className="text-right p-3 font-medium">Orders</th>
                  <th className="text-right p-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{v.logo}</span>
                        <span className="font-medium">{v.storeName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{v.category}</td>
                    <td className="p-3 text-center">
                      <Badge variant={v.status === "active" ? "default" : v.status === "pending" ? "secondary" : "destructive"} className="text-xs capitalize">{v.status}</Badge>
                    </td>
                    <td className="p-3 text-right">{v.totalProducts}</td>
                    <td className="p-3 text-right">{v.totalOrders.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium">₹{(v.totalRevenue / 100000).toFixed(1)}L</td>
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
