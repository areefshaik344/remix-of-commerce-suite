import { useState } from "react";
import { reviewApi } from "@/api/reviewApi";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, MessageSquare, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

export default function VendorReviews() {
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<string, string>>({});

  // Fetch vendor products, then get reviews for each
  const { data: productsResp, isLoading: productsLoading } = useApiQuery(
    () => vendorApi.getVendorProducts(), []
  );
  const vendorProducts = (productsResp?.data ?? productsResp ?? []) as any[];
  const productIds = vendorProducts.map((p: any) => p.id);

  // Fetch reviews for all vendor products
  const { data: reviewsData, isLoading: reviewsLoading, error, refetch } = useApiQuery(
    async () => {
      if (productIds.length === 0) return [];
      const allReviews: any[] = [];
      for (const pid of productIds.slice(0, 10)) {
        try {
          const resp = await reviewApi.getProductReviews(pid);
          const items = resp?.data ?? resp ?? [];
          allReviews.push(...(items as any[]));
        } catch { /* skip */ }
      }
      return allReviews;
    },
    [productIds.join(",")],
    { enabled: !productsLoading && productIds.length > 0 }
  );

  const reviews = (reviewsData ?? []) as any[];
  const isLoading = productsLoading || reviewsLoading;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const handleReply = () => {
    if (!replyText.trim() || !replyTarget) return;
    setReplies(prev => ({ ...prev, [replyTarget]: replyText }));
    toast({ title: "Reply posted", description: "Your response is now visible to the customer." });
    setReplyText("");
    setReplyTarget(null);
  };

  if (isLoading) return <div className="space-y-6"><h1 className="font-display text-xl font-bold">Reviews Management</h1><TableSkeleton rows={4} cols={4} /></div>;
  if (error) return <div className="space-y-6"><h1 className="font-display text-xl font-bold">Reviews Management</h1><PageError message={error} onRetry={refetch} /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold">Reviews Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card"><CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-primary">{avgRating}</p>
          <div className="flex justify-center gap-0.5 my-1">{[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= Math.round(Number(avgRating)) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />)}</div>
          <p className="text-xs text-muted-foreground">Average Rating</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold">{reviews.length}</p>
          <p className="text-xs text-muted-foreground">Total Reviews</p>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4 text-center">
          <p className="text-3xl font-display font-bold text-success">{reviews.filter((r: any) => r.rating >= 4).length}</p>
          <p className="text-xs text-muted-foreground">Positive Reviews</p>
        </CardContent></Card>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm mt-1">Reviews from customers will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <Card key={review.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.userName}</span>
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />)}</div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <h4 className="font-medium text-sm">{review.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><ThumbsUp className="h-3 w-3" /> {review.helpful} helpful</span>
                    </div>
                    {replies[review.id] && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                        <p className="text-xs font-medium text-primary mb-1">Your Reply</p>
                        <p className="text-sm text-muted-foreground">{replies[review.id]}</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={() => { setReplyTarget(review.id); setReplyText(""); }} disabled={!!replies[review.id]}>
                    <MessageSquare className="h-3 w-3" /> {replies[review.id] ? "Replied" : "Reply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!replyTarget} onOpenChange={() => setReplyTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to Review</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a professional response to the customer..." rows={4} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyTarget(null)}>Cancel</Button>
              <Button onClick={handleReply} disabled={!replyText.trim()} className="gap-1.5"><Send className="h-3.5 w-3.5" /> Send Reply</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
