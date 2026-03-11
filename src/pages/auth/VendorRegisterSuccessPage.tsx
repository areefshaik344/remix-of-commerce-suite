import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";

export default function VendorRegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="shadow-elevated border-0 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Application Submitted!</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your vendor application has been received and is under review.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-left space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Review Timeline</p>
                <p className="text-xs text-muted-foreground">Our team will review your application within 2-3 business days.</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• You'll receive an email notification once approved</p>
              <p>• After approval, complete KYC & bank details in Vendor Onboarding</p>
              <p>• Then start listing products immediately</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button asChild className="w-full gap-1.5">
              <Link to="/">Go to Homepage <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
