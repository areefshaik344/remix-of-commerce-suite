import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="container py-20 flex justify-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }}>
        <Card className="shadow-elevated max-w-md w-full text-center">
          <CardContent className="p-8 space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle2 className="h-16 w-16 mx-auto text-success" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold">Order Placed!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been confirmed.</p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-display font-bold text-lg">{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground">You'll receive a confirmation email with tracking details shortly.</p>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild className="gap-2">
                <Link to="/orders"><Package className="h-4 w-4" /> View My Orders</Link>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link to="/products">Continue Shopping <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
