import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye } from "lucide-react";
import { SearchEmpty } from "@/components/shared/EmptyState";
import { TablePagination, usePagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  returned: "bg-muted text-muted-foreground",
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: ordersResp, isLoading, error, refetch } = useApiQuery(
    () => adminApi.getAllOrders(), []
  );

  const orders = (ordersResp?.data ?? ordersResp ?? []) as any[];

  const filtered = orders
    .filter((o: any) => o.id.toLowerCase().includes(search.toLowerCase()))
    .filter((o: any) => statusFilter === "all" || o.status === statusFilter);

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 8);

  if (isLoading) return <div className="space-y-6"><h1 className="font-display text-xl font-bold">All Orders</h1><TableSkeleton rows={6} cols={6} /></div>;
  if (error) return <div className="space-y-6"><h1 className="font-display text-xl font-bold">All Orders</h1><PageError message={error} onRetry={refetch} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">All Orders</h1>
        <Badge variant="outline">{orders.length} orders</Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by order ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <SearchEmpty query={search || statusFilter} />
          ) : (
            <>
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
                  {paginatedItems.map((o: any) => (
                    <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <TableCell className="font-mono text-sm font-medium">{o.id}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{o.items.map((i: any) => i.productName).join(", ")}</TableCell>
                      <TableCell className="font-medium text-sm">₹{o.total.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-sm">{o.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`border-0 capitalize ${statusColors[o.status] || ""}`}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${o.id}`); }}><Eye className="h-4 w-4" /></Button>
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
    </div>
  );
}
