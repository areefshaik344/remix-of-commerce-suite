import { orders } from "@/data/mock-orders";
import { users } from "@/data/mock-users";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { SearchEmpty } from "@/components/shared/EmptyState";
import { TablePagination, usePagination } from "@/components/shared/Pagination";

const getUserName = (userId: string) => {
  const user = users.find(u => u.id === userId);
  return user?.name || userId;
};

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-accent/10 text-accent-foreground",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function VendorOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders
    .filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.items.some(i => i.productName.toLowerCase().includes(search.toLowerCase())))
    .filter(o => statusFilter === "all" || o.status === statusFilter);

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or product..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 text-xs"><SelectValue /></SelectTrigger>
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Order ID</th>
                      <th className="text-left p-3 font-medium">Items</th>
                      <th className="text-left p-3 font-medium">Customer</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Payment</th>
                      <th className="text-right p-3 font-medium">Amount</th>
                      <th className="text-right p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map(order => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/vendor/orders/${order.id}`)}>
                        <td className="p-3 font-mono text-sm font-medium">{order.id}</td>
                        <td className="p-3 text-muted-foreground max-w-[200px] truncate">{order.items.map(i => i.productName).join(", ")}</td>
                        <td className="p-3 text-muted-foreground">{getUserName(order.userId)}</td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className={`text-xs capitalize border-0 ${statusColors[order.status] || ""}`}>{order.status}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{order.paymentMethod}</td>
                        <td className="p-3 text-right font-medium">₹{order.total.toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
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
    </div>
  );
}
