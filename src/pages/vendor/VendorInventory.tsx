import { useState } from "react";
import { products } from "@/features/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, AlertTriangle, TrendingDown, Archive, Search, Upload, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VendorInventory() {
  const { toast } = useToast();
  const vendorProducts = products.filter(p => p.vendorId === "v-1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(vendorProducts.map(p => [p.id, p.stockCount]))
  );

  const lowStockCount = vendorProducts.filter(p => stocks[p.id] <= 10).length;
  const outOfStockCount = vendorProducts.filter(p => stocks[p.id] === 0).length;
  const totalUnits = Object.values(stocks).reduce((a, b) => a + b, 0);

  const filtered = vendorProducts
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => {
      if (filter === "low") return stocks[p.id] > 0 && stocks[p.id] <= 10;
      if (filter === "out") return stocks[p.id] === 0;
      if (filter === "healthy") return stocks[p.id] > 10;
      return true;
    });

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(p => p.id));
  };

  const updateStock = (id: string, value: number) => {
    setStocks(prev => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const bulkRestock = () => {
    if (selected.length === 0) return;
    const updated = { ...stocks };
    selected.forEach(id => { updated[id] = (updated[id] || 0) + 50; });
    setStocks(updated);
    setSelected([]);
    toast({ title: "Bulk restock", description: `Restocked ${selected.length} products (+50 each)` });
  };

  const getStockStatus = (count: number) => {
    if (count === 0) return { label: "Out of Stock", variant: "destructive" as const, className: "" };
    if (count <= 10) return { label: "Low Stock", variant: "secondary" as const, className: "bg-warning/10 text-warning border-0" };
    return { label: "In Stock", variant: "default" as const, className: "bg-primary/10 text-primary border-0" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">Track and manage stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Bulk Import</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={String(vendorProducts.length)} icon={Package} />
        <StatCard title="Total Units" value={totalUnits.toLocaleString()} icon={Archive} />
        <StatCard title="Low Stock" value={String(lowStockCount)} icon={TrendingDown} change="Needs attention" changeType="negative" />
        <StatCard title="Out of Stock" value={String(outOfStockCount)} icon={AlertTriangle} change="Urgent" changeType="negative" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 w-64" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="healthy">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">{selected.length} selected</span>
            <Button size="sm" onClick={bulkRestock} className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Restock +50</Button>
          </div>
        )}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 w-10">
                    <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                  </th>
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">SKU</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Stock</th>
                  <th className="text-center p-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const stock = stocks[product.id];
                  const status = getStockStatus(stock);
                  return (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <Checkbox checked={selected.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">SKU-{product.id.split("-")[1]}</td>
                      <td className="p-3 text-center">
                        <Badge variant={status.variant} className={`text-xs ${status.className}`}>{status.label}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${stock === 0 ? "text-destructive" : stock <= 10 ? "text-warning" : ""}`}>{stock}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateStock(product.id, stock - 1)}>-</Button>
                          <Input
                            type="number"
                            value={stock}
                            onChange={e => updateStock(product.id, parseInt(e.target.value) || 0)}
                            className="h-7 w-16 text-center text-sm [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateStock(product.id, stock + 1)}>+</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
