import { useWishlistStore } from "@/store/wishlistStore";
import { productApi } from "@/api/productApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ProductCard } from "@/features/product";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductGridSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

export default function WishlistPage() {
  const wishlist = useWishlistStore(s => s.wishlist);

  // Fetch all products, then filter client-side for wishlist
  const { data: productsResp, isLoading, error, refetch } = useApiQuery(
    () => productApi.getProducts({ pageSize: 100 }),
    []
  );

  const allProducts = productsResp?.items ?? productsResp?.data?.items ?? productsResp?.data ?? productsResp ?? [];
  const wishlistProducts = (allProducts as any[]).filter((p: any) => wishlist.includes(p.id));

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="font-display text-xl font-bold mb-4">My Wishlist</h1>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <h1 className="font-display text-xl font-bold mb-4">My Wishlist</h1>
        <PageError message={error} onRetry={refetch} />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container py-20 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-4">Save items you love for later</p>
        <Button asChild><Link to="/products">Explore Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="font-display text-xl font-bold mb-4">My Wishlist ({wishlistProducts.length} items)</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlistProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
