import { useNavigate, useParams } from "react-router-dom";
import { vendors } from "@/data/mock-users";
import { products } from "@/data/mock-products";
import { orders } from "@/data/mock-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Check, X, Ban, Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function AdminVendorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const vendor = vendors.find(v => v.id === id);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [localStatus, setLocalStatus] = useState(vendor?.status || "pending");

  const vendorProducts = products.filter(p => p.vendorId === id);
  const vendorOrders = orders.filter(o => o.vendorId === id);

  if (!vendor) {
    return <div className="flex items-center justify-center h-64"><div className="text-center"><p className="text-lg font-medium">Vendor not found</p><Button variant="link" onClick={() => navigate("/admin/vendors")}>Back</Button></div></div>;
  }

  const handleApprove = () => {
    setLocalStatus("active");
    toast({ title: "Vendor approved", description: `${vendor.storeName} is now active on the marketplace.` });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({ title: "Reason required", description: "Please provide a rejection reason.", variant: "destructive" });
      return;
    }
    setLocalStatus("suspended");
    setShowReject(false);
    toast({ title: "Vendor rejected", description: `${vendor.storeName} has been rejected.`, variant: "destructive" });
  };

  const handleSuspend = () => {
    setLocalStatus("suspended");
    toast({ title: "Vendor suspended", description: `${vendor.storeName} has been suspended.`, variant: "destructive" });
  };

  const handleReactivate = () => {
    setLocalStatus("active");
    toast({ title: "Vendor reactivated", description: `${vendor.storeName} is now active.` });
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
                <div className="text-4xl mb-2">{vendor.logo}</div>
                <p className="font-semibold">{vendor.storeName}</p>
                <p className="text-sm text-muted-foreground">{vendor.category}</p>
                <div className="flex items-center gap-1 mt-2"><Star className="h-4 w-4 fill-warning text-warning" /><span className="font-medium">{vendor.rating}</span></div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div><p className="text-lg font-bold">{vendor.totalProducts}</p><p className="text-muted-foreground">Products</p></div>
                <div><p className="text-lg font-bold">{vendor.totalOrders.toLocaleString()}</p><p className="text-muted-foreground">Orders</p></div>
              </div>
              <div className="mt-3 text-center"><p className="text-lg font-bold">₹{(vendor.totalRevenue / 100000).toFixed(1)}L</p><p className="text-xs text-muted-foreground">Total Revenue</p></div>
            </CardContent>
          </Card>

          {/* Approval Actions */}
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

          {/* KYC / Documents mock */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Documents & KYC</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">PAN</span><Badge variant="outline" className="bg-success/10 text-success border-0">Verified</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST</span><Badge variant="outline" className="bg-success/10 text-success border-0">Verified</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Bank Account</span><Badge variant="outline" className="bg-success/10 text-success border-0">Verified</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Address Proof</span><Badge variant="secondary">Pending</Badge></div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Products */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Products ({vendorProducts.length})</CardTitle></CardHeader>
            <CardContent>
              {vendorProducts.length === 0 ? <p className="text-sm text-muted-foreground">No products listed.</p> : (
                <div className="space-y-2">
                  {vendorProducts.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/products/${p.id}`)}>
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.category}</p></div>
                      <p className="font-medium text-sm">₹{p.price.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Recent Orders ({vendorOrders.length})</CardTitle></CardHeader>
            <CardContent>
              {vendorOrders.length === 0 ? <p className="text-sm text-muted-foreground">No orders.</p> : (
                <div className="space-y-2">
                  {vendorOrders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div><p className="font-mono text-sm">{o.id}</p><p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p></div>
                      <div className="text-right"><p className="font-medium text-sm">₹{o.total.toLocaleString("en-IN")}</p><Badge variant="secondary" className="text-[10px] capitalize">{o.status}</Badge></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
