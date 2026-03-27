import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, AlertTriangle, Package, Bell, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { getErrorMessage } from "@/api/errorMapper";

export default function VendorLowStockAlerts() {
  const navigate = useNavigate();
  const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>({});
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const { data: productsResp, isLoading, error, refetch } = useApiQuery(
    () => vendorApi.getLowStockProducts(), []
  );

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load low stock data" />;

  const allProducts: any[] = Array.isArray(productsResp) ? productsResp : [];
  const outOfStock = allProducts.filter(p => p.stockCount === 0);
  const critical = allProducts.filter(p => p.stockCount > 0 && p.stockCount <= 20);
  const warning = allProducts.filter(p => p.stockCount > 20 && p.stockCount <= 100);

  const handleRestock = async (productId: string, productName: string) => {
    const amount = restockAmounts[productId];
    if (!amount || parseInt(amount) <= 0) {
      toast({ title: "Invalid quantity", description: "Enter a valid restock amount.", variant: "destructive" });
      return;
    }
    try {
      await vendorApi.updateInventory(productId, parseInt(amount));
      toast({ title: "Restock initiated", description: `${amount} units queued for "${productName}".` });
      setRestockAmounts(prev => ({ ...prev, [productId]: "" }));
      refetch();
    } catch (e) {
      toast({ title: "Restock failed", description: getErrorMessage(e), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/inventory")}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="font-display text-xl font-bold">Low Stock Alerts</h1>
            <p className="text-sm text-muted-foreground">{allProducts.length} products need attention</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setAlertsEnabled(!alertsEnabled); toast({ title: alertsEnabled ? "Alerts paused" : "Alerts resumed" }); }}>
          {alertsEnabled ? <><BellOff className="h-4 w-4 mr-1" /> Pause Alerts</> : <><Bell className="h-4 w-4 mr-1" /> Resume Alerts</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><Package className="h-5 w-5 text-destructive" /></div>
              <div><p className="text-2xl font-bold">{outOfStock.length}</p><p className="text-xs text-muted-foreground">Out of Stock</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-warning" /></div>
              <div><p className="text-2xl font-bold">{critical.length}</p><p className="text-xs text-muted-foreground">Critical (≤20)</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Bell className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-bold">{warning.length}</p><p className="text-xs text-muted-foreground">Warning (≤100)</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Products Needing Restock</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Restock Qty</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProducts.sort((a: any, b: any) => a.stockCount - b.stockCount).map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || p.image || "/placeholder.svg"} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div><p className="font-medium text-sm line-clamp-1">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell>
                    <Badge variant={p.stockCount === 0 ? "destructive" : p.stockCount <= 20 ? "secondary" : "outline"} className={p.stockCount <= 20 && p.stockCount > 0 ? "bg-warning/10 text-warning border-0" : ""}>
                      {p.stockCount} units
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.stockCount === 0 ? <Badge variant="destructive">Out of Stock</Badge> : p.stockCount <= 20 ? <Badge className="bg-warning/10 text-warning border-0">Critical</Badge> : <Badge variant="outline">Low</Badge>}
                  </TableCell>
                  <TableCell>
                    <Input type="number" className="w-20 h-8 text-sm" placeholder="Qty" value={restockAmounts[p.id] || ""} onChange={e => setRestockAmounts(prev => ({ ...prev, [p.id]: e.target.value }))} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleRestock(p.id, p.name)}>Restock</Button>
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
