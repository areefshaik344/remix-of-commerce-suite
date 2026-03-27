import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/api/authApi";
import { getErrorMessage } from "@/api/errorMapper";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(result.data.email);
      setSent(true);
    } catch (err) {
      toast({ title: "Request failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <Card className="shadow-elevated border-0">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full gradient-primary flex items-center justify-center mb-2">
              {sent ? <Check className="h-6 w-6 text-primary-foreground" /> : <Mail className="h-6 w-6 text-primary-foreground" />}
            </div>
            <CardTitle className="text-xl font-display">{sent ? "Check your email" : "Reset password"}</CardTitle>
            <CardDescription>
              {sent
                ? `We've sent a password reset link to ${email}`
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email address</Label>
                  <Input type="email" placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button onClick={() => setSent(false)} className="text-primary hover:underline">try again</button>.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
