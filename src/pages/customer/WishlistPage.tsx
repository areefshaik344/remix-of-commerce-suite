import { useStore } from "@/store/useStore";
import { products } from "@/data/mock-products";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

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
        {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
