import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WriteReviewFormProps {
  productId: string;
  onSubmit?: () => void;
}

export function WriteReviewForm({ productId, onSubmit }: WriteReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
    setRating(0);
    setTitle("");
    setComment("");
    onSubmit?.();
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs mb-2 block">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-secondary text-secondary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground self-center">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                </span>
              )}
            </div>
          </div>
          <div>
            <Label className="text-xs">Review Title</Label>
            <Input
              placeholder="Summarize your experience"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-xs">Your Review</Label>
            <Textarea
              placeholder="What did you like or dislike about this product?"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="mt-1"
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
