import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

const coupons = [
  { id: "1", code: "MYSHOP15", type: "percentage", value: 15, minOrder: 500, used: 45, status: "active", endDate: "2025-03-31" },
  { id: "2", code: "FLAT100", type: "flat", value: 100, minOrder: 999, used: 22, status: "active", endDate: "2025-02-28" },
  { id: "3", code: "LAUNCH20", type: "percentage", value: 20, minOrder: 0, used: 89, status: "expired", endDate: "2024-12-31" },
];

export default function VendorCoupons() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Coupons & Promotions</h1>
          <p className="text-sm text-muted-foreground">Create and manage your store discount codes</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create Coupon</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map(c => (
                <TableRow key={c.id}>
                  <TableCell><code className="font-mono font-semibold text-sm">{c.code}</code></TableCell>
                  <TableCell className="capitalize text-sm">{c.type}</TableCell>
                  <TableCell className="text-sm">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</TableCell>
                  <TableCell className="text-sm">₹{c.minOrder}</TableCell>
                  <TableCell className="text-sm">{c.used}</TableCell>
                  <TableCell className="text-sm">{c.endDate}</TableCell>
                  <TableCell><Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
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
