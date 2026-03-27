import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, Upload, FileText, Building2, CreditCard, ShieldCheck, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vendorApi } from "@/api/vendorApi";
import { getErrorMessage } from "@/api/errorMapper";

const STEPS = ["Business Info", "KYC Documents", "Bank Details", "Review & Submit"];

export default function VendorOnboarding() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Business Info
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // KYC
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panUploaded, setPanUploaded] = useState(false);
  const [gstUploaded, setGstUploaded] = useState(false);
  const [addressProofUploaded, setAddressProofUploaded] = useState(false);
  const [idType, setIdType] = useState("");

  // Bank
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [cancelledChequeUploaded, setCancelledChequeUploaded] = useState(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await vendorApi.submitOnboarding({
        businessName, businessType, category, description,
        address, city, state, pincode, phone, email,
        panNumber, gstNumber,
        accountName, accountNumber, ifscCode, bankName, branch,
      });
      toast({
        title: "Application Submitted!",
        description: "Your vendor application has been submitted for review. You'll receive an update within 2-3 business days.",
      });
    } catch (e) {
      toast({ title: "Submission failed", description: getErrorMessage(e), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const DocumentUploadBox = ({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: () => void }) => (
    <div
      onClick={() => !uploaded && onUpload()}
      className={`flex items-center gap-3 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors ${
        uploaded ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/50"
      }`}
    >
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${uploaded ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        {uploaded ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{uploaded ? "Document uploaded" : "Click to upload (PDF, JPG, PNG)"}</p>
      </div>
      {uploaded && <Badge className="bg-primary/10 text-primary border-0">Uploaded</Badge>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-xl font-bold">Vendor Onboarding</h1>
        <p className="text-sm text-muted-foreground">Complete your profile to start selling</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-1.5 text-xs ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/10 text-primary border-2 border-primary" : "bg-muted"}`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {step === 0 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Business Name *</Label><Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your store name" /></div>
              <div className="space-y-2"><Label>Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent><SelectItem value="individual">Individual</SelectItem><SelectItem value="partnership">Partnership</SelectItem><SelectItem value="pvtltd">Pvt Ltd</SelectItem><SelectItem value="llp">LLP</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Primary Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent><SelectItem value="electronics">Electronics</SelectItem><SelectItem value="fashion">Fashion</SelectItem><SelectItem value="home">Home & Living</SelectItem><SelectItem value="beauty">Beauty</SelectItem><SelectItem value="books">Books</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell customers about your business" rows={3} /></div>
              <div className="space-y-2 col-span-2"><Label>Business Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
              <div className="space-y-2"><Label>City</Label><Input value={city} onChange={e => setCity(e.target.value)} /></div>
              <div className="space-y-2"><Label>State</Label><Input value={state} onChange={e => setState(e.target.value)} /></div>
              <div className="space-y-2"><Label>Pincode</Label><Input value={pincode} onChange={e => setPincode(e.target.value)} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div className="space-y-2 col-span-2"><Label>Business Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" /></div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> KYC Documents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>PAN Number *</Label><Input value={panNumber} onChange={e => setPanNumber(e.target.value)} placeholder="ABCDE1234F" /></div>
              <div className="space-y-2"><Label>GST Number</Label><Input value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="29AABCU9603R1ZM" /></div>
            </div>
            <Separator />
            <div className="space-y-3">
              <DocumentUploadBox label="PAN Card Copy" uploaded={panUploaded} onUpload={() => setPanUploaded(true)} />
              <DocumentUploadBox label="GST Certificate" uploaded={gstUploaded} onUpload={() => setGstUploaded(true)} />
              <div className="space-y-2">
                <Label>ID Proof Type</Label>
                <Select value={idType} onValueChange={setIdType}>
                  <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                  <SelectContent><SelectItem value="aadhaar">Aadhaar Card</SelectItem><SelectItem value="passport">Passport</SelectItem><SelectItem value="voter">Voter ID</SelectItem><SelectItem value="driving">Driving License</SelectItem></SelectContent>
                </Select>
              </div>
              <DocumentUploadBox label="Address Proof" uploaded={addressProofUploaded} onUpload={() => setAddressProofUploaded(true)} />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Bank Details</CardTitle><CardDescription>For receiving payouts</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Account Holder Name *</Label><Input value={accountName} onChange={e => setAccountName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Account Number *</Label><Input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} /></div>
              <div className="space-y-2"><Label>IFSC Code *</Label><Input value={ifscCode} onChange={e => setIfscCode(e.target.value)} /></div>
              <div className="space-y-2"><Label>Bank Name</Label><Input value={bankName} onChange={e => setBankName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Branch</Label><Input value={branch} onChange={e => setBranch(e.target.value)} /></div>
            </div>
            <Separator />
            <DocumentUploadBox label="Cancelled Cheque / Passbook" uploaded={cancelledChequeUploaded} onUpload={() => setCancelledChequeUploaded(true)} />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Review & Submit</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Business Name</span><p className="font-medium">{businessName || "—"}</p></div>
              <div><span className="text-muted-foreground">Type</span><p className="font-medium">{businessType || "—"}</p></div>
              <div><span className="text-muted-foreground">Category</span><p className="font-medium">{category || "—"}</p></div>
              <div><span className="text-muted-foreground">Email</span><p className="font-medium">{email || "—"}</p></div>
              <div><span className="text-muted-foreground">PAN</span><p className="font-medium">{panNumber || "—"}</p></div>
              <div><span className="text-muted-foreground">GST</span><p className="font-medium">{gstNumber || "—"}</p></div>
              <div><span className="text-muted-foreground">Bank Account</span><p className="font-medium">{accountNumber ? `****${accountNumber.slice(-4)}` : "—"}</p></div>
              <div><span className="text-muted-foreground">IFSC</span><p className="font-medium">{ifscCode || "—"}</p></div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
              <p className="text-xs text-warning">By submitting, you confirm that all the details provided are accurate. Your application will be reviewed within 2-3 business days.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
