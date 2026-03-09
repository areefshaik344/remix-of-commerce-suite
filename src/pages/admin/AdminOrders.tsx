import { orders } from "@/data/mock-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  returned: "bg-muted text-muted-foreground",
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const filtered = orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">All Orders</h1>
        <Badge variant="outline">{orders.length} orders</Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by order ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-sm font-medium">{o.id}</TableCell>
                  <TableCell className="text-sm">{o.items.map(i => i.productName).join(", ")}</TableCell>
                  <TableCell className="font-medium text-sm">₹{o.total.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm">{o.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`border-0 capitalize ${statusColors[o.status] || ""}`}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
