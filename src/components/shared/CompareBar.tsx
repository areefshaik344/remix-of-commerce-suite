import { useStore } from "@/store/useStore";
import { products } from "@/features/product";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useStore();
  const compareProducts = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-elevated"
      >
        <div className="container py-3 flex items-center gap-4">
          <span className="text-sm font-medium shrink-0">Compare ({compareList.length}/4)</span>
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {compareProducts.map(p => p && (
              <div key={p.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 shrink-0">
                <img src={p.images[0]} alt="" className="h-8 w-8 object-cover rounded" />
                <span className="text-xs font-medium max-w-[120px] truncate">{p.name}</span>
                <button onClick={() => removeFromCompare(p.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={clearCompare} className="text-xs">Clear</Button>
            <Button size="sm" className="gap-1 text-xs" asChild disabled={compareList.length < 2}>
              <Link to="/compare">Compare <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
