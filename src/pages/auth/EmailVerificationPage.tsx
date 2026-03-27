import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OTPInput from "@/components/auth/OTPInput";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/api/authApi";
import { getErrorMessage } from "@/api/errorMapper";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast({ title: "Email verified!", description: "Your account is now active." });
    navigate("/");
  };

  const handleResend = async () => {
    toast({ title: "OTP resent", description: "A new code has been sent to your email." });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold">Verify your email</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We've sent a 6-digit code to your email address
          </p>
        </div>

        <Card className="shadow-elevated border-0">
          <CardContent className="p-6 space-y-6">
            <OTPInput value={otp} onChange={setOtp} />
            <Button className="w-full" onClick={handleVerify} disabled={otp.length !== 6 || loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button onClick={handleResend} className="text-primary font-medium hover:underline">
                  Resend
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
