import { reviews } from "@/data/mock-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

export default function VendorReviews() {
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

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
          <p className="text-3xl font-display font-bold text-success">{reviews.filter(r => r.rating >= 4).length}</p>
          <p className="text-xs text-muted-foreground">Positive Reviews</p>
        </CardContent></Card>
      </div>

      <div className="space-y-3">
        {reviews.map(review => (
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
                </div>
                <Button variant="outline" size="sm" className="gap-1 shrink-0">
                  <MessageSquare className="h-3 w-3" /> Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
