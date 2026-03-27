import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Users, TrendingUp, ShoppingBag, Download, Star } from "lucide-react";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";

const fmt = (v: number) => `₹${(v / 10000000).toFixed(1)}Cr`;

export default function AdminReporting() {
  const { data: report, isLoading, error, refetch } = useApiQuery(
    () => adminApi.getReporting(),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) return <PageError message={error} onRetry={refetch} />;

  // Fallback defaults for data structure
  const gmvData = report?.gmvData || [];
  const userGrowth = report?.userGrowth || [];
  const vendorPerformance = report?.vendorPerformance || [];
  const categoryPerformance = report?.categoryPerformance || [];
  const stats = report?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Platform Reporting</h1>
          <p className="text-sm text-muted-foreground">Revenue, GMV, user growth, and vendor performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6m">
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total GMV" value={stats.totalGMV ? fmt(stats.totalGMV) : "—"} icon={ShoppingBag} change={stats.gmvChange || ""} changeType="positive" />
        <StatCard title="Net Revenue" value={stats.netRevenue ? fmt(stats.netRevenue) : "—"} icon={DollarSign} change={stats.revenueChange || ""} changeType="positive" />
        <StatCard title="Total Users" value={stats.totalUsers?.toLocaleString() || "—"} icon={Users} change={stats.userChange || ""} changeType="positive" />
        <StatCard title="Avg. Order Value" value={stats.avgOrderValue ? `₹${stats.avgOrderValue.toLocaleString()}` : "—"} icon={TrendingUp} change={stats.aovChange || ""} changeType="positive" />
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & GMV</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">GMV vs Net Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={gmvData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} className="text-xs" />
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="gmv" name="GMV" className="fill-primary/20 stroke-primary" strokeWidth={2} />
                  <Area type="monotone" dataKey="netRevenue" name="Net Revenue" className="fill-accent/20 stroke-accent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Customer Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="customers" name="Customers" className="fill-primary/20 stroke-primary" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Vendor Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="vendors" name="Vendors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Vendor Performance Scorecard</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-center">Rating</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-center">AOV</TableHead>
                      <TableHead className="text-center">Conversion</TableHead>
                      <TableHead className="text-center">Return Rate</TableHead>
                      <TableHead className="text-center">Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorPerformance.map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{v.logo}</span>
                            <div>
                              <p className="font-medium text-sm">{v.storeName}</p>
                              <p className="text-xs text-muted-foreground">{v.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-0.5 text-sm"><Star className="h-3 w-3 fill-warning text-warning" />{v.rating}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium">₹{((v.totalRevenue || 0) / 100000).toFixed(1)}L</TableCell>
                        <TableCell className="text-right text-muted-foreground">{(v.totalOrders || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-center text-muted-foreground">₹{(v.avgOrderValue || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">{v.conversionRate}%</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={parseFloat(v.returnRate) > 4 ? "destructive" : "secondary"} className="text-xs">{v.returnRate}%</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`text-xs ${parseFloat(v.fulfillmentScore) >= 4 ? "bg-primary/10 text-primary border-0" : "bg-warning/10 text-warning border-0"}`}>
                            {v.fulfillmentScore}/5
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Category Performance</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">GMV</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-center">Growth</TableHead>
                    <TableHead className="text-center">Market Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryPerformance.map((c: any) => (
                    <TableRow key={c.category}>
                      <TableCell className="font-medium">{c.category}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(c.gmv || 0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{(c.orders || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">{c.growth}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">{c.share}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
