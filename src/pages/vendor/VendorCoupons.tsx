import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";

export default function VendorCoupons() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);

  const { data: coupons = [], isLoading, error, refetch } = useApiQuery(
    () => vendorApi.getVendorCoupons(),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) return <PageError message={error} onRetry={refetch} />;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await vendorApi.deleteCoupon(deleteTarget.id);
      toast({ title: "Coupon deleted", description: `"${deleteTarget.code}" has been removed.` });
      refetch();
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Coupons & Promotions</h1>
          <p className="text-sm text-muted-foreground">Create and manage your store discount codes</p>
        </div>
        <Button size="sm" onClick={() => navigate("/vendor/coupons/new")}><Plus className="h-4 w-4 mr-1" /> Create Coupon</Button>
      </div>

      <Card className="shadow-card">
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
              {coupons.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell><code className="font-mono font-semibold text-sm">{c.code}</code></TableCell>
                  <TableCell className="capitalize text-sm">{c.type || c.discountType}</TableCell>
                  <TableCell className="text-sm">{(c.type || c.discountType) === "percentage" ? `${c.value || c.discountValue}%` : `₹${c.value || c.discountValue}`}</TableCell>
                  <TableCell className="text-sm">₹{c.minOrder || c.minOrderAmount || 0}</TableCell>
                  <TableCell className="text-sm">{c.used || c.usageCount || 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.endDate || c.expiresAt || "—"}</TableCell>
                  <TableCell><Badge variant={c.status === "active" ? "default" : "secondary"} className="capitalize">{c.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/vendor/coupons/new")}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteTarget({ id: c.id, code: c.code })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        description={`Are you sure you want to delete coupon "${deleteTarget?.code}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
