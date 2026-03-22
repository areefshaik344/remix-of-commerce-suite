import { useNavigate, useParams } from "react-router-dom";
import { products } from "@/features/product";
import { reviews } from "@/features/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star, Check, Ban, AlertTriangle, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function AdminProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const productReviews = reviews.filter(r => r.productId === id);
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "rejected" | "pending">("approved");
  const [rejectionNote, setRejectionNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  if (!product) {
    return <div className="flex items-center justify-center h-64"><div className="text-center"><p className="text-lg font-medium">Product not found</p><Button variant="link" onClick={() => navigate("/admin/products")}>Back</Button></div></div>;
  }

  const handleApprove = () => {
    setApprovalStatus("approved");
    setShowReject(false);
    toast({ title: "Product approved", description: `"${product.name}" is now live.` });
  };

  const handleReject = () => {
    if (!rejectionNote.trim()) {
      toast({ title: "Reason required", variant: "destructive" });
      return;
    }
    setApprovalStatus("rejected");
    setShowReject(false);
    toast({ title: "Product rejected", description: `"${product.name}" has been rejected.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">by {product.vendorName}</p>
        </div>
        <Badge variant={approvalStatus === "approved" ? "default" : approvalStatus === "rejected" ? "destructive" : "secondary"} className="capitalize">{approvalStatus}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Images */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Product Images</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm text-muted-foreground mb-1">Description</p><p className="text-sm">{product.description}</p></div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Category:</span> {product.category}</div>
                <div><span className="text-muted-foreground">Subcategory:</span> {product.subcategory}</div>
                <div><span className="text-muted-foreground">Brand:</span> {product.brand}</div>
                <div><span className="text-muted-foreground">Stock:</span> {product.stockCount} units</div>
              </div>
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">{product.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>
              )}
            </CardContent>
          </Card>

          {/* Specs */}
          {Object.keys(product.specs).length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base">Specifications</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm py-1 border-b last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{String(v)}</span></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Reviews ({productReviews.length})</CardTitle></CardHeader>
            <CardContent>
              {productReviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : (
                <div className="space-y-3">
                  {productReviews.map(r => (
                    <div key={r.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />)}</div>
                        <span className="font-medium text-sm">{r.userName}</span>
                      </div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Pricing */}
          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Selling Price</span><span className="text-lg font-bold">₹{product.price.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">MRP</span><span className="line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><Badge variant="secondary">{product.discount}% off</Badge></div>
              <Separator />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rating</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{product.rating} ({product.reviewCount})</span></div>
            </CardContent>
          </Card>

          {/* Approval Workflow */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Moderation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2" variant={approvalStatus === "approved" ? "secondary" : "default"} onClick={handleApprove} disabled={approvalStatus === "approved"}><Check className="h-4 w-4" /> Approve</Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={() => setShowReject(!showReject)}><Ban className="h-4 w-4" /> Reject</Button>
              {showReject && (
                <div className="space-y-2 pt-2">
                  <Textarea value={rejectionNote} onChange={e => setRejectionNote(e.target.value)} placeholder="Reason for rejection..." rows={3} />
                  <Button variant="destructive" size="sm" className="w-full" onClick={handleReject}>Confirm Rejection</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor Info */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Vendor</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{product.vendorName}</p>
              <p className="text-muted-foreground">Vendor ID: {product.vendorId}</p>
              <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate(`/admin/vendors/${product.vendorId}`)}>View Vendor Profile →</Button>
            </CardContent>
          </Card>

          {/* Variants */}
          {product.variants.length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base">Variants</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {product.variants.map((v, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium mb-1">{v.name}</p>
                    <div className="flex flex-wrap gap-1">{v.options.map(o => <Badge key={o} variant="outline" className="text-xs">{o}</Badge>)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
