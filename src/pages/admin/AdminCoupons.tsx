import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const coupons = [
  { id: "1", code: "SUMMER25", type: "percentage", value: 25, minOrder: 999, maxDiscount: 500, usageLimit: 1000, used: 342, startDate: "2025-01-01", endDate: "2025-03-31", status: "active" },
  { id: "2", code: "FLAT200", type: "flat", value: 200, minOrder: 1499, maxDiscount: 200, usageLimit: 500, used: 178, startDate: "2025-01-15", endDate: "2025-02-28", status: "active" },
  { id: "3", code: "WELCOME10", type: "percentage", value: 10, minOrder: 0, maxDiscount: 300, usageLimit: null as number | null, used: 1205, startDate: "2024-01-01", endDate: "2025-12-31", status: "active" },
  { id: "4", code: "DIWALI50", type: "percentage", value: 50, minOrder: 2000, maxDiscount: 1000, usageLimit: 200, used: 200, startDate: "2024-10-20", endDate: "2024-11-05", status: "expired" },
  { id: "5", code: "FREESHIP", type: "free_shipping", value: 0, minOrder: 299, maxDiscount: 0, usageLimit: null as number | null, used: 856, startDate: "2025-01-01", endDate: "2025-06-30", status: "active" },
];

export default function AdminCoupons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Coupons & Promotions</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes and promotional campaigns</p>
        </div>
        <Button size="sm" onClick={() => navigate("/vendor/coupons/new")}><Plus className="h-4 w-4 mr-1" /> Create Coupon</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold">{coupons.filter(c => c.status === "active").length}</p>
          <p className="text-xs text-muted-foreground">Active Coupons</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold">{coupons.reduce((s, c) => s + c.used, 0).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Redemptions</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold">₹1,24,500</p>
          <p className="text-xs text-muted-foreground">Total Discount Given</p>
        </CardContent></Card>
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
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <code className="font-mono font-semibold text-sm">{c.code}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText(c.code); toast({ title: "Copied!", description: c.code }); }}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{c.type.replace("_", " ")}</TableCell>
                  <TableCell className="text-sm">{c.type === "percentage" ? `${c.value}%` : c.type === "flat" ? `₹${c.value}` : "Free"}</TableCell>
                  <TableCell className="text-sm">₹{c.minOrder}</TableCell>
                  <TableCell className="text-sm">{c.used}{c.usageLimit ? `/${c.usageLimit}` : ""}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.startDate} → {c.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(c.code)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Coupon"
        description={`Are you sure you want to delete coupon "${deleteTarget}"? Active users will no longer be able to use it.`}
        confirmLabel="Delete"
        onConfirm={() => { toast({ title: "Coupon deleted", description: `"${deleteTarget}" removed.` }); setDeleteTarget(null); }}
      />
    </div>
  );
}
