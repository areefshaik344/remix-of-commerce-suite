import { useParams, Link } from "react-router-dom";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ProductCard } from "@/features/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Package, ShoppingCart, MapPin } from "lucide-react";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

export default function VendorStorePage() {
  const { vendorSlug } = useParams();

  const { data: vendorResp, isLoading: vendorLoading, error: vendorError, refetch: refetchVendor } = useApiQuery(
    () => vendorApi.getVendorBySlug(vendorSlug!),
    [vendorSlug],
    { enabled: !!vendorSlug }
  );

  const vendor = vendorResp?.data ?? vendorResp;

  const { data: productsResp, isLoading: productsLoading } = useApiQuery(
    () => vendorApi.getVendorStoreProducts(vendor?.id),
    [vendor?.id],
    { enabled: !!vendor?.id }
  );

  const vendorProducts = (productsResp?.data ?? productsResp ?? []) as any[];

  if (vendorLoading || productsLoading) return <DashboardSkeleton />;
  if (vendorError) return <PageError message={vendorError} onRetry={refetchVendor} />;

  if (!vendor) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-display text-xl font-bold mb-2">Store not found</h2>
        <Button asChild><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Card className="shadow-card overflow-hidden">
        <div className="gradient-primary h-24" />
        <CardContent className="p-6 -mt-10 relative">
          <div className="flex items-end gap-4">
            <div className="h-20 w-20 rounded-xl bg-card border-4 border-card flex items-center justify-center text-4xl shadow-elevated">
              {vendor.logo || "🏪"}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold">{vendor.storeName}</h1>
                {vendor.status === "active" && (
                  <Badge className="bg-success/10 text-success border-0 text-[10px]">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{vendor.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-lg font-display font-bold">
                {vendor.rating} <Star className="h-4 w-4 fill-secondary text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-lg font-display font-bold">{vendor.totalProducts}</p>
              <p className="text-xs text-muted-foreground">Products</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-lg font-display font-bold">{(vendor.totalOrders || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-lg font-display font-bold">{vendor.category}</p>
              <p className="text-xs text-muted-foreground">Category</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-display text-lg font-bold mb-4">All Products ({vendorProducts.length})</h2>
        {vendorProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {vendorProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No products listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
