import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { loginSchema, phoneLoginSchema, otpSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Eye, EyeOff, ShieldCheck, ChevronRight, Truck, Tag, Headphones } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/api/errorMapper";
import { authApi } from "@/api/authApi";
import OTPInput from "@/components/auth/OTPInput";
import { useOtpCooldown } from "@/hooks/useOtpCooldown";

export default function LoginPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { cooldown, isCoolingDown, startCooldown, resetCooldown } = useOtpCooldown();

  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await login(result.data.email, result.data.password);
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      const from = (location.state as { from?: string })?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      toast({ title: "Login failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    const result = phoneLoginSchema.safeParse({ phone });
    if (!result.success) {
      toast({ title: "Invalid phone", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOtp(phone);
      setOtpSent(true);
      startCooldown();
      const devOtp = res.otp ? ` (Dev OTP: ${res.otp})` : "";
      toast({ title: "OTP Sent!", description: `A 6-digit OTP has been sent to +91 ${phone}${devOtp}` });
    } catch (err) {
      toast({ title: "Failed to send OTP", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      toast({ title: "Invalid OTP", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, otp);
      loginWithToken(res.accessToken, res.user);
      toast({ title: "Welcome!", description: "Phone verified successfully." });
      const from = (location.state as { from?: string })?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      toast({ title: "Verification failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[480px] gradient-primary flex-col justify-between p-10 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-10 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          <Link to="/">
            <h1 className="text-3xl font-display font-bold">MarketHub</h1>
          </Link>
          <p className="text-sm mt-1 opacity-80">India's favourite multi-vendor marketplace</p>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Free Delivery</p>
              <p className="text-xs opacity-70">On orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Best Prices</p>
              <p className="text-xs opacity-70">Verified by millions of shoppers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">24/7 Support</p>
              <p className="text-xs opacity-70">Dedicated customer support</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs opacity-60">© 2025 MarketHub. All rights reserved.</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-display font-bold">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Log in to access your account</p>
          </div>

          <Card className="shadow-elevated border-0">
            <CardContent className="p-6">
              <Tabs value={tab} onValueChange={(v) => { setTab(v as "email" | "phone"); setOtpSent(false); }}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="email" className="gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="gap-1.5 text-xs">
                    <Phone className="h-3.5 w-3.5" /> Phone OTP
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="mt-4">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone" className="mt-4">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mobile Number</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 rounded-md border bg-muted text-sm font-medium text-muted-foreground">
                            +91
                          </div>
                          <Input
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            maxLength={10}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSendOTP} className="w-full" disabled={loading}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          OTP sent to <span className="font-medium text-foreground">+91 {phone}</span>
                        </p>
                        <button onClick={() => setOtpSent(false)} className="text-xs text-primary hover:underline mt-1">
                          Change number
                        </button>
                      </div>
                      <OTPInput value={otp} onChange={setOtp} />
                      <Button onClick={handleVerifyOTP} className="w-full" disabled={loading || otp.length !== 6}>
                        {loading ? "Verifying..." : "Verify & Login"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Didn't receive?{" "}
                        {isCoolingDown ? (
                          <span className="text-muted-foreground">Resend in {cooldown}s</span>
                        ) : (
                          <button onClick={handleSendOTP} className="text-primary hover:underline">Resend OTP</button>
                        )}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              New to MarketHub?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
            </p>
            <Separator />
            <Link to="/vendor/register" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ShieldCheck className="h-4 w-4" /> Sell on MarketHub <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
