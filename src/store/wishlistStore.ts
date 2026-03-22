import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface WishlistState {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  devtools(persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        set({
          wishlist: wishlist.includes(productId)
            ? wishlist.filter(id => id !== productId)
            : [...wishlist, productId],
        });
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    { name: "markethub-wishlist" }
  ), { name: "WishlistStore" })
);
