import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Check, X, Ban, Package, ShoppingCart, DollarSign } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

export default function AdminVendorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  const { data: vendorResp, isLoading, error, refetch } = useApiQuery(
    () => adminApi.getVendorById(id!), [id], { enabled: !!id }
  );
  const vendor = vendorResp?.data ?? vendorResp;
  const [localStatus, setLocalStatus] = useState(vendor?.status || "pending");

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message={error} onRetry={refetch} />;
  if (!vendor) return <div className="flex items-center justify-center h-64"><div className="text-center"><p className="text-lg font-medium">Vendor not found</p><Button variant="link" onClick={() => navigate("/admin/vendors")}>Back</Button></div></div>;

  const handleApprove = async () => {
    try { await adminApi.approveVendor(vendor.id); setLocalStatus("active"); toast({ title: "Vendor approved", description: `${vendor.storeName} is now active.` }); }
    catch { toast({ title: "Action failed", variant: "destructive" }); }
  };
  const handleReject = async () => {
    if (!rejectionReason.trim()) { toast({ title: "Reason required", variant: "destructive" }); return; }
    try { await adminApi.rejectVendor(vendor.id); setLocalStatus("suspended"); setShowReject(false); toast({ title: "Vendor rejected", variant: "destructive" }); }
    catch { toast({ title: "Action failed", variant: "destructive" }); }
  };
  const handleSuspend = async () => {
    try { await adminApi.rejectVendor(vendor.id); setLocalStatus("suspended"); toast({ title: "Vendor suspended", variant: "destructive" }); }
    catch { toast({ title: "Action failed", variant: "destructive" }); }
  };
  const handleReactivate = async () => {
    try { await adminApi.approveVendor(vendor.id); setLocalStatus("active"); toast({ title: "Vendor reactivated" }); }
    catch { toast({ title: "Action failed", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/vendors")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">{vendor.storeName}</h1>
          <p className="text-sm text-muted-foreground">{vendor.description}</p>
        </div>
        <Badge variant={localStatus === "active" ? "default" : localStatus === "pending" ? "secondary" : "destructive"} className="capitalize">{localStatus}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-2">{vendor.logo || "🏪"}</div>
                <p className="font-semibold">{vendor.storeName}</p>
                <p className="text-sm text-muted-foreground">{vendor.category}</p>
                <div className="flex items-center gap-1 mt-2"><Star className="h-4 w-4 fill-warning text-warning" /><span className="font-medium">{vendor.rating}</span></div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div><p className="text-lg font-bold">{vendor.totalProducts}</p><p className="text-muted-foreground">Products</p></div>
                <div><p className="text-lg font-bold">{(vendor.totalOrders || 0).toLocaleString()}</p><p className="text-muted-foreground">Orders</p></div>
              </div>
              <div className="mt-3 text-center"><p className="text-lg font-bold">₹{((vendor.totalRevenue || 0) / 100000).toFixed(1)}L</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {localStatus === "pending" && (
                <>
                  <Button className="w-full justify-start gap-2" onClick={handleApprove}><Check className="h-4 w-4" /> Approve Vendor</Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={() => setShowReject(!showReject)}><X className="h-4 w-4" /> Reject Vendor</Button>
                  {showReject && (
                    <div className="space-y-2 pt-2">
                      <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." rows={3} />
                      <Button variant="destructive" size="sm" className="w-full" onClick={handleReject}>Confirm Rejection</Button>
                    </div>
                  )}
                </>
              )}
              {localStatus === "active" && (
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={handleSuspend}><Ban className="h-4 w-4" /> Suspend Vendor</Button>
              )}
              {localStatus === "suspended" && (
                <Button className="w-full justify-start gap-2" onClick={handleReactivate}><Check className="h-4 w-4" /> Reactivate Vendor</Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {vendor.products && vendor.products.length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Products ({vendor.products.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendor.products.slice(0, 5).map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/products/${p.id}`)}>
                      <img src={p.images?.[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.category}</p></div>
                      <p className="font-medium text-sm">₹{p.price?.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {vendor.recentOrders && vendor.recentOrders.length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Recent Orders ({vendor.recentOrders.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendor.recentOrders.slice(0, 5).map((o: any) => (
                    <div key={o.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div><p className="font-mono text-sm">{o.id}</p><p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p></div>
                      <div className="text-right"><p className="font-medium text-sm">₹{o.total?.toLocaleString("en-IN")}</p><Badge variant="secondary" className="text-[10px] capitalize">{o.status}</Badge></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
