import { analyticsData } from "@/data/mock-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { DollarSign, ShoppingCart, Users, Store } from "lucide-react";

const COLORS = ["hsl(221,83%,53%)", "hsl(38,92%,50%)", "hsl(280,67%,54%)", "hsl(142,71%,45%)", "hsl(0,72%,51%)"];

export default function AdminAnalytics() {
  const fmt = (v: number) => `₹${(v / 10000000).toFixed(1)}Cr`;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold">Analytics & Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={fmt(analyticsData.totalRevenue)} icon={DollarSign} change="+14%" changeType="positive" />
        <StatCard title="Total Orders" value={analyticsData.totalOrders.toLocaleString()} icon={ShoppingCart} change="+8%" changeType="positive" />
        <StatCard title="Total Customers" value={analyticsData.totalCustomers.toLocaleString()} icon={Users} change="+12%" changeType="positive" />
        <StatCard title="Active Vendors" value={String(analyticsData.totalVendors)} icon={Store} change="+5%" changeType="positive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} className="text-xs" />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="revenue" className="fill-primary/20 stroke-primary" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Top Categories by Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData.topCategories}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="category" className="text-xs" />
                <YAxis tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} className="text-xs" />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {analyticsData.topCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Orders by Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={analyticsData.ordersByStatus} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="count" nameKey="status" label={({ status, percent }) => `${status} ${(percent*100).toFixed(0)}%`}>
                  {analyticsData.ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
