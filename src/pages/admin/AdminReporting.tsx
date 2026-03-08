import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, Users, TrendingUp, ShoppingBag, Download, Star } from "lucide-react";
import { vendors } from "@/data/mock-users";

const gmvData = [
  { month: "Sep", gmv: 12500000, netRevenue: 1875000 },
  { month: "Oct", gmv: 18900000, netRevenue: 2835000 },
  { month: "Nov", gmv: 28400000, netRevenue: 4260000 },
  { month: "Dec", gmv: 34200000, netRevenue: 5130000 },
  { month: "Jan", gmv: 22100000, netRevenue: 3315000 },
  { month: "Feb", gmv: 19800000, netRevenue: 2970000 },
];

const userGrowth = [
  { month: "Sep", customers: 12400, vendors: 42 },
  { month: "Oct", customers: 15800, vendors: 48 },
  { month: "Nov", customers: 21200, vendors: 55 },
  { month: "Dec", customers: 28900, vendors: 62 },
  { month: "Jan", customers: 32100, vendors: 68 },
  { month: "Feb", customers: 35600, vendors: 74 },
];

const vendorPerformance = vendors.slice(0, 8).map(v => ({
  ...v,
  conversionRate: (Math.random() * 4 + 1).toFixed(1),
  returnRate: (Math.random() * 5 + 1).toFixed(1),
  avgOrderValue: Math.round(v.totalRevenue / (v.totalOrders || 1)),
  fulfillmentScore: (Math.random() * 1.5 + 3.5).toFixed(1),
}));

const categoryPerformance = [
  { category: "Electronics", gmv: 45600000, orders: 22300, growth: "+14%", share: "33%" },
  { category: "Fashion", gmv: 28900000, orders: 18700, growth: "+22%", share: "21%" },
  { category: "Home & Living", gmv: 18200000, orders: 8900, growth: "+8%", share: "13%" },
  { category: "Beauty", gmv: 15600000, orders: 12400, growth: "+31%", share: "11%" },
  { category: "Books", gmv: 8900000, orders: 45000, growth: "+5%", share: "6%" },
  { category: "Groceries", gmv: 12300000, orders: 28000, growth: "+18%", share: "9%" },
];

const COLORS = ["hsl(221,83%,53%)", "hsl(38,92%,50%)", "hsl(280,67%,54%)", "hsl(142,71%,45%)", "hsl(0,72%,51%)", "hsl(180,60%,45%)"];
const fmt = (v: number) => `₹${(v / 10000000).toFixed(1)}Cr`;

export default function AdminReporting() {
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
        <StatCard title="Total GMV" value={fmt(gmvData.reduce((s, d) => s + d.gmv, 0))} icon={ShoppingBag} change="+18% YoY" changeType="positive" />
        <StatCard title="Net Revenue" value={fmt(gmvData.reduce((s, d) => s + d.netRevenue, 0))} icon={DollarSign} change="+22% YoY" changeType="positive" />
        <StatCard title="Total Users" value="35,600" icon={Users} change="+187% growth" changeType="positive" />
        <StatCard title="Avg. Order Value" value="₹2,450" icon={TrendingUp} change="+8% vs last month" changeType="positive" />
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
                    {vendorPerformance.map(v => (
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
                        <TableCell className="text-right font-medium">₹{(v.totalRevenue / 100000).toFixed(1)}L</TableCell>
                        <TableCell className="text-right text-muted-foreground">{v.totalOrders.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-muted-foreground">₹{v.avgOrderValue.toLocaleString()}</TableCell>
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
                  {categoryPerformance.map((c, i) => (
                    <TableRow key={c.category}>
                      <TableCell className="font-medium">{c.category}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(c.gmv)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{c.orders.toLocaleString()}</TableCell>
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
