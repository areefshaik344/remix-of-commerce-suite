import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Eye, ShoppingCart, DollarSign, Users, Download } from "lucide-react";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useState } from "react";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

// Static data for conversion/traffic (not from API yet)
const conversionData = [
  { month: "Sep", rate: 2.1 }, { month: "Oct", rate: 2.8 }, { month: "Nov", rate: 3.4 },
  { month: "Dec", rate: 3.8 }, { month: "Jan", rate: 3.2 }, { month: "Feb", rate: 3.5 },
];

const trafficSources = [
  { source: "Organic Search", visits: 4500, percentage: 38, change: "+12%" },
  { source: "Direct", visits: 2800, percentage: 24, change: "+5%" },
  { source: "Social Media", visits: 1900, percentage: 16, change: "+28%" },
  { source: "Paid Ads", visits: 1400, percentage: 12, change: "-3%" },
  { source: "Referral", visits: 1200, percentage: 10, change: "+8%" },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(38 92% 50%)", "hsl(280 67% 54%)", "hsl(142 71% 45%)"];

export default function VendorAnalytics() {
  const [period, setPeriod] = useState("7d");

  const { data: analyticsResp, isLoading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useApiQuery(
    () => vendorApi.getVendorAnalytics(), []
  );
  const { data: productsResp, isLoading: productsLoading } = useApiQuery(
    () => vendorApi.getVendorProducts(), []
  );

  const analytics = analyticsResp?.data ?? analyticsResp;
  const vendorProducts = (productsResp?.data ?? productsResp ?? []) as any[];
  const topProducts = [...vendorProducts].sort((a: any, b: any) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5);

  if (analyticsLoading || productsLoading) return <DashboardSkeleton />;
  if (analyticsError) return <PageError message={analyticsError} onRetry={refetchAnalytics} />;

  const salesData = (analytics?.monthlySales || []).map((d: any) => ({
    day: d.month,
    sales: d.revenue || 0,
    orders: d.orders || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Store Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your store performance and growth</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Visitors" value="9,010" change="+14.2%" changeType="positive" icon={Eye} />
        <StatCard title="Total Orders" value={(analytics?.orders || 0).toLocaleString()} change="+9.8%" changeType="positive" icon={ShoppingCart} />
        <StatCard title="Revenue" value={`₹${((analytics?.revenue || 0) / 100000).toFixed(1)}L`} change="+18.5%" changeType="positive" icon={DollarSign} />
        <StatCard title="Conversion Rate" value="3.5%" change="+0.3%" changeType="positive" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Sales Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="sales" className="fill-primary/20 stroke-primary" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Conversion Rate (%)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Traffic Sources</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {trafficSources.map((s, i) => (
              <div key={s.source} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{s.source}</span>
                    <span className="text-sm text-muted-foreground">{s.visits.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: COLORS[i] }} />
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${s.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>{s.change}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Top Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p: any, i: number) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                        <img src={p.images?.[0]} alt={p.name} className="h-8 w-8 rounded object-cover" />
                        <span className="text-sm font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{Math.round((p.reviewCount || 0) / 10)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">₹{((p.price || 0) * Math.round((p.reviewCount || 0) / 10)).toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
