import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Percent, TrendingUp, Settings2 } from "lucide-react";
import { categories } from "@/features/product";
import { vendors } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";

const categoryCommissions = [
  { category: "Electronics", rate: 8, minFee: 25, orders: 12500, revenue: 2340000 },
  { category: "Fashion", rate: 15, minFee: 15, orders: 8900, revenue: 1890000 },
  { category: "Home & Living", rate: 12, minFee: 20, orders: 4500, revenue: 780000 },
  { category: "Beauty", rate: 18, minFee: 10, orders: 7800, revenue: 1200000 },
  { category: "Sports", rate: 12, minFee: 15, orders: 2100, revenue: 450000 },
  { category: "Books", rate: 5, minFee: 5, orders: 34000, revenue: 340000 },
  { category: "Groceries", rate: 10, minFee: 10, orders: 12000, revenue: 560000 },
  { category: "Toys & Games", rate: 15, minFee: 15, orders: 5600, revenue: 420000 },
];

const vendorOverrides = [
  { vendor: "AppleZone Official", category: "Electronics", standardRate: 8, customRate: 6, reason: "Volume discount" },
  { vendor: "BookHaven", category: "Books", standardRate: 5, customRate: 3, reason: "Exclusive partner" },
];

export default function AdminCommission() {
  const { toast } = useToast();
  const [rates, setRates] = useState(
    Object.fromEntries(categoryCommissions.map(c => [c.category, c.rate]))
  );

  const totalCommissionRevenue = categoryCommissions.reduce((s, c) => s + c.revenue, 0);

  const updateRate = (cat: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 50) {
      setRates(prev => ({ ...prev, [cat]: num }));
    }
  };

  const handleSave = () => {
    toast({ title: "Commission rates updated", description: "New rates will apply to future orders." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Commission & Fees</h1>
        <p className="text-sm text-muted-foreground">Configure platform commission per category and vendor</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg. Commission" value="11.2%" icon={Percent} change="+0.5% vs last quarter" changeType="positive" />
        <StatCard title="Commission Revenue" value={`₹${(totalCommissionRevenue / 100000).toFixed(1)}L`} icon={DollarSign} change="+18%" changeType="positive" />
        <StatCard title="Active Overrides" value={String(vendorOverrides.length)} icon={Settings2} />
        <StatCard title="Pending Settlements" value="₹23.4L" icon={TrendingUp} change="12 vendors" changeType="neutral" />
      </div>

      {/* Category Commission */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Category Commission Rates</CardTitle>
          <CardDescription>Set default commission percentage per product category</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Commission %</TableHead>
                <TableHead className="text-center">Min Fee (₹)</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryCommissions.map(c => (
                <TableRow key={c.category}>
                  <TableCell className="font-medium">{c.category}</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={rates[c.category]}
                      onChange={e => updateRate(c.category, e.target.value)}
                      className="h-8 w-20 text-center mx-auto"
                      min={0}
                      max={50}
                    />
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">₹{c.minFee}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{c.orders.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">₹{(c.revenue / 100000).toFixed(1)}L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave}>Save Commission Rates</Button>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Overrides */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Vendor-Specific Overrides</CardTitle>
          <CardDescription>Custom commission rates for specific vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Standard Rate</TableHead>
                <TableHead className="text-center">Custom Rate</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorOverrides.map((o, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{o.vendor}</TableCell>
                  <TableCell className="text-muted-foreground">{o.category}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{o.standardRate}%</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-primary/10 text-primary border-0">{o.customRate}%</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator className="my-4" />
          <Button variant="outline" size="sm">+ Add Override</Button>
        </CardContent>
      </Card>

      {/* Fee Structure */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Platform Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Payment Gateway Fee", value: "2.0%", desc: "Per transaction" },
              { label: "Shipping Surcharge", value: "₹15", desc: "Per shipment (marketplace logistics)" },
              { label: "Return Processing Fee", value: "₹25", desc: "Per return order" },
            ].map(f => (
              <div key={f.label} className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-2xl font-bold mt-1">{f.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
