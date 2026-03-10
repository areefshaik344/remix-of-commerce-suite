import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vendors } from "@/data/mock-users";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Star, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TablePagination, usePagination } from "@/components/shared/Pagination";
import { toast } from "@/hooks/use-toast";

export default function AdminVendors() {
  const navigate = useNavigate();
  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(vendors, 8);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Vendor Management</h1>
        <p className="text-sm text-muted-foreground">{vendors.length} vendors registered</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Store</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Rating</th>
                  <th className="text-right p-3 font-medium">Products</th>
                  <th className="text-right p-3 font-medium">Orders</th>
                  <th className="text-right p-3 font-medium">Revenue</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(v => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/admin/vendors/${v.id}`)}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{v.logo}</span>
                        <div>
                          <p className="font-medium">{v.storeName}</p>
                          <p className="text-xs text-muted-foreground">{v.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{v.category}</td>
                    <td className="p-3 text-center">
                      <Badge variant={v.status === "active" ? "default" : v.status === "pending" ? "secondary" : "destructive"} className="text-xs capitalize">{v.status}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-warning text-warning" />{v.rating}</span>
                    </td>
                    <td className="p-3 text-right">{v.totalProducts}</td>
                    <td className="p-3 text-right">{v.totalOrders.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium">₹{(v.totalRevenue / 100000).toFixed(1)}L</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                        {v.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => setApproveTarget(v.storeName)}><Check className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setRejectTarget(v.storeName)}><X className="h-4 w-4" /></Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/vendors/${v.id}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Products</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setSuspendTarget(v.storeName)}>Suspend</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={8} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!approveTarget}
        onOpenChange={() => setApproveTarget(null)}
        title="Approve Vendor"
        description={`Approve "${approveTarget}" to start selling on the platform?`}
        confirmLabel="Approve"
        variant="default"
        onConfirm={() => { toast({ title: "Vendor approved", description: `${approveTarget} is now active.` }); setApproveTarget(null); }}
      />
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={() => setRejectTarget(null)}
        title="Reject Vendor"
        description={`Reject "${rejectTarget}"'s application? They will be notified via email.`}
        confirmLabel="Reject"
        onConfirm={() => { toast({ title: "Vendor rejected", description: `${rejectTarget} has been rejected.` }); setRejectTarget(null); }}
      />
      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={() => setSuspendTarget(null)}
        title="Suspend Vendor"
        description={`Suspend "${suspendTarget}"? Their products will be hidden from the marketplace.`}
        confirmLabel="Suspend"
        onConfirm={() => { toast({ title: "Vendor suspended", description: `${suspendTarget} has been suspended.` }); setSuspendTarget(null); }}
      />
    </div>
  );
}
