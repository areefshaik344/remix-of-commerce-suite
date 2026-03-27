import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, ShieldCheck, ChevronRight, Mail, Phone } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, phoneLoginSchema, otpSchema } from "@/lib/validators";
import { getErrorMessage } from "@/api/errorMapper";
import { authApi } from "@/api/authApi";
import OTPInput from "@/components/auth/OTPInput";
import { useOtpCooldown } from "@/hooks/useOtpCooldown";

export default function SignupPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");

  // Email signup state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Phone OTP signup state
  const [otpPhone, setOtpPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpName, setOtpName] = useState("");
  const [otpAgreed, setOtpAgreed] = useState(false);

  const { signup, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cooldown, isCoolingDown, startCooldown, resetCooldown } = useOtpCooldown();

  // ── Email Signup ──
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    const result = signupSchema.safeParse({ name, email, phone, password, confirmPassword, agreed });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0]?.toString() || "form";
        if (!errors[field]) errors[field] = err.message;
      });
      setFormErrors(errors);
      toast({ title: "Please fix the errors", description: Object.values(errors)[0], variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signup(result.data.name, result.data.email, result.data.phone, result.data.password);
      toast({ title: "Account created!", description: "Please verify your email." });
      navigate("/verify-email");
    } catch (err) {
      toast({ title: "Signup failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Phone OTP Send ──
  const handleSendOTP = async () => {
    const result = phoneLoginSchema.safeParse({ phone: otpPhone });
    if (!result.success) {
      toast({ title: "Invalid phone", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOtp(otpPhone);
      setOtpSent(true);
      startCooldown();
      toast({ title: "OTP Sent!", description: `A 6-digit OTP has been sent to +91 ${otpPhone}${devOtp}` });
    } catch (err) {
      toast({ title: "Failed to send OTP", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Phone OTP Verify ──
  const handleVerifyOTP = async () => {
    const result = otpSchema.safeParse({ otp });
    if (!result.success) {
      toast({ title: "Invalid OTP", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(otpPhone, otp);
      // Store auth data temporarily, show name step
      setOtpVerified(true);
      // Save token for after name entry
      (window as any).__otpAuthResponse = res;
      toast({ title: "Phone verified!", description: "One more step — enter your name." });
    } catch (err) {
      toast({ title: "Verification failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Complete Phone Signup (set name) ──
  const handleCompletePhoneSignup = async () => {
    if (!otpName.trim()) {
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!otpAgreed) {
      toast({ title: "Terms required", description: "Please agree to the Terms of Service.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const authRes = (window as any).__otpAuthResponse;
      // Set auth and then update profile name
      loginWithToken(authRes.accessToken, { ...authRes.user, name: otpName.trim() });
      // Update name on backend
      const { userApi } = await import("@/api/userApi");
      await userApi.updateProfile({ name: otpName.trim() }).catch(() => {});
      delete (window as any).__otpAuthResponse;
      toast({ title: "Account created!", description: "Welcome to MarketHub!" });
      navigate("/", { replace: true });
    } catch (err) {
      toast({ title: "Failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { label: "", color: "", width: "0%" };
    if (password.length < 6) return { label: "Weak", color: "bg-destructive", width: "33%" };
    if (password.length < 10) return { label: "Medium", color: "bg-warning", width: "66%" };
    return { label: "Strong", color: "bg-success", width: "100%" };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-[480px] gradient-primary flex-col justify-between p-10 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-10 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          <Link to="/">
            <h1 className="text-3xl font-display font-bold">MarketHub</h1>
          </Link>
          <p className="text-sm mt-1 opacity-80">Join millions of happy shoppers</p>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-sm font-medium mb-3">Why join MarketHub?</p>
            <ul className="space-y-2 text-xs opacity-90">
              <li className="flex items-center gap-2">✓ Access 10,000+ verified sellers</li>
              <li className="flex items-center gap-2">✓ Track orders in real-time</li>
              <li className="flex items-center gap-2">✓ Exclusive member-only deals</li>
              <li className="flex items-center gap-2">✓ Easy 7-day returns</li>
              <li className="flex items-center gap-2">✓ Secure payments with buyer protection</li>
            </ul>
          </div>
        </div>
        <p className="relative z-10 text-xs opacity-60">© 2025 MarketHub. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-display font-bold">Create your account</h2>
            <p className="text-sm text-muted-foreground mt-1">Start shopping in under a minute</p>
          </div>

          <Card className="shadow-elevated border-0">
            <CardContent className="p-6">
              <Tabs value={tab} onValueChange={(v) => { setTab(v as "email" | "phone"); setOtpSent(false); setOtpVerified(false); setOtp(""); }}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="email" className="gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="gap-1.5 text-xs">
                    <Phone className="h-3.5 w-3.5" /> Phone OTP
                  </TabsTrigger>
                </TabsList>

                {/* ── Email Tab ── */}
                <TabsContent value="email" className="mt-4">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input type="email" placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                      {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 rounded-md border bg-muted text-sm font-medium text-muted-foreground">+91</div>
                        <Input placeholder="98765 43210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} maxLength={10} required />
                      </div>
                      {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} transition-all rounded-full`} style={{ width: strength.width }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{strength.label}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                      />
                      {confirmPassword && confirmPassword !== password && (
                        <p className="text-xs text-destructive">Passwords don't match</p>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
                      <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>

                {/* ── Phone OTP Tab ── */}
                <TabsContent value="phone" className="mt-4">
                  {!otpSent ? (
                    /* Step 1: Enter phone number */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mobile Number</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 rounded-md border bg-muted text-sm font-medium text-muted-foreground">+91</div>
                          <Input
                            placeholder="98765 43210"
                            value={otpPhone}
                            onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            maxLength={10}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">We'll send a 6-digit OTP to verify your number</p>
                      <Button onClick={handleSendOTP} className="w-full" disabled={loading || otpPhone.length !== 10}>
                        {loading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : !otpVerified ? (
                    /* Step 2: Enter OTP */
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          OTP sent to <span className="font-medium text-foreground">+91 {otpPhone}</span>
                        </p>
                        <button onClick={() => { setOtpSent(false); setOtp(""); }} className="text-xs text-primary hover:underline mt-1">
                          Change number
                        </button>
                      </div>
                      <OTPInput value={otp} onChange={setOtp} />
                      <Button onClick={handleVerifyOTP} className="w-full" disabled={loading || otp.length !== 6}>
                        {loading ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Didn't receive? <button onClick={handleSendOTP} className="text-primary hover:underline">Resend OTP</button>
                      </p>
                    </div>
                  ) : (
                    /* Step 3: Enter name after OTP verified */
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="h-10 w-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Phone verified! ✓</p>
                        <p className="text-xs text-muted-foreground mt-1">Just one more step to complete your account</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Your Name</Label>
                        <Input placeholder="Rahul Sharma" value={otpName} onChange={e => setOtpName(e.target.value)} autoFocus />
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox id="otp-terms" checked={otpAgreed} onCheckedChange={(v) => setOtpAgreed(v === true)} className="mt-0.5" />
                        <label htmlFor="otp-terms" className="text-xs text-muted-foreground leading-relaxed">
                          I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                      <Button onClick={handleCompletePhoneSignup} className="w-full" disabled={loading || !otpName.trim() || !otpAgreed}>
                        {loading ? "Creating account..." : "Complete Signup"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
            <Separator />
            <Link to="/vendor/register" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ShieldCheck className="h-4 w-4" /> Start selling on MarketHub <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
