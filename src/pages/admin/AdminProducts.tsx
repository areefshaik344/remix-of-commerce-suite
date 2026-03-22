import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/features/product";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Ban, Check } from "lucide-react";
import { SearchEmpty } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TablePagination, usePagination } from "@/components/shared/Pagination";
import { toast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [banTarget, setBanTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Product Moderation</h1>
        <Badge variant="outline">{products.length} products</Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {filtered.length === 0 && search ? (
            <SearchEmpty query={search} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map(p => (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => navigate(`/admin/products/${p.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{p.category}</TableCell>
                      <TableCell className="text-sm">{p.vendorName}</TableCell>
                      <TableCell className="font-medium text-sm">₹{p.price.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={p.stockCount > 50 ? "default" : "destructive"} className={p.stockCount > 50 ? "bg-success/10 text-success border-0" : ""}>
                          {p.stockCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success border-0">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/products/${p.id}`)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setBanTarget({ id: p.id, name: p.name })}><Ban className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={8} />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!banTarget}
        onOpenChange={() => setBanTarget(null)}
        title="Remove Product"
        description={`Are you sure you want to remove "${banTarget?.name}" from the platform? The vendor will be notified.`}
        confirmLabel="Remove Product"
        onConfirm={() => { toast({ title: "Product removed", description: `"${banTarget?.name}" has been delisted.` }); setBanTarget(null); }}
      />
    </div>
  );
}
