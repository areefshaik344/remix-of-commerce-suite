import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OTPInput from "@/components/auth/OTPInput";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/api/authApi";
import { getErrorMessage } from "@/api/errorMapper";
import { useOtpCooldown } from "@/hooks/useOtpCooldown";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { cooldown, isCoolingDown, startCooldown } = useOtpCooldown();

  // Get email from route state (passed from signup page)
  const email = (location.state as { email?: string })?.email || "";

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyEmail(otp);
      toast({ title: "Email verified!", description: "Your account is now active." });
      navigate("/login");
    } catch (err) {
      toast({ title: "Verification failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({ title: "Email not found", description: "Please sign up again.", variant: "destructive" });
      return;
    }
    setResending(true);
    try {
      await authApi.resendVerification(email);
      startCooldown();
      toast({ title: "OTP resent", description: "A new code has been sent to your email." });
    } catch (err) {
      toast({ title: "Resend failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setResending(false);
    }
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
            We've sent a 6-digit code to{" "}
            {email ? <span className="font-medium text-foreground">{email}</span> : "your email address"}
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
                <button
                  onClick={handleResend}
                  disabled={isCoolingDown || resending}
                  className="text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending
                    ? "Sending..."
                    : isCoolingDown
                      ? `Resend in ${cooldown}s`
                      : "Resend"}
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
