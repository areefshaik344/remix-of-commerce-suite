import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/features/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Star } from "lucide-react";
import { SearchEmpty } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TablePagination, usePagination } from "@/components/shared/Pagination";
import { toast } from "@/hooks/use-toast";

export default function VendorProducts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const vendorProducts = products.filter(p => p.vendorId === "v-1");
  const filtered = vendorProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 8);

  const handleDelete = () => {
    if (deleteTarget) {
      toast({ title: "Product deleted", description: `"${deleteTarget.name}" has been removed.` });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{vendorProducts.length} products in your store</p>
        </div>
        <Button className="gap-1.5" onClick={() => navigate("/vendor/products/new")}><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {filtered.length === 0 && search ? (
            <SearchEmpty query={search} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Product</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-right p-3 font-medium">Price</th>
                      <th className="text-center p-3 font-medium">Stock</th>
                      <th className="text-center p-3 font-medium">Rating</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map(product => (
                      <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{product.category}</td>
                        <td className="p-3 text-right font-medium">₹{product.price.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-center">
                          <Badge variant={product.stockCount > 100 ? "default" : product.stockCount > 10 ? "secondary" : "destructive"} className="text-xs">
                            {product.stockCount}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-warning text-warning" />{product.rating}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/vendor/products/${product.id}/edit`)}><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ id: product.id, name: product.name })}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={8} />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
