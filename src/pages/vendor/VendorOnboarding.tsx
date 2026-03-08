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

const STEPS = ["Business Info", "KYC Documents", "Bank Details", "Review & Submit"];

export default function VendorOnboarding() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();

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

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "Your vendor application has been submitted for review. You'll receive an update within 2-3 business days.",
    });
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

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Step {step + 1} of {STEPS.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/20 text-primary border border-primary" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Business Info */}
      {step === 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Business Information</CardTitle>
            <CardDescription>Tell us about your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business / Store Name *</Label>
                <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. TechZone Electronics" />
              </div>
              <div className="space-y-2">
                <Label>Business Type *</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual / Sole Proprietor</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="pvtltd">Private Limited</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home & Living</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="groceries">Groceries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="business@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Business Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you sell..." rows={3} />
            </div>
            <Separator />
            <p className="text-sm font-medium">Business Address</p>
            <div className="space-y-2">
              <Label>Address Line</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="400001" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: KYC Documents */}
      {step === 1 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> KYC Documents</CardTitle>
            <CardDescription>Upload verification documents for compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-accent/50 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">All documents are securely stored and verified. This is a one-time process.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PAN Number *</Label>
                <Input value={panNumber} onChange={e => setPanNumber(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label>GST Number</Label>
                <Input value={gstNumber} onChange={e => setGstNumber(e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </div>
            </div>
            <Separator />
            <p className="text-sm font-medium">Upload Documents</p>
            <div className="space-y-3">
              <DocumentUploadBox label="PAN Card" uploaded={panUploaded} onUpload={() => setPanUploaded(true)} />
              <DocumentUploadBox label="GST Certificate (Optional)" uploaded={gstUploaded} onUpload={() => setGstUploaded(true)} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Address Proof Type</Label>
              <Select value={idType} onValueChange={setIdType}>
                <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driving">Driving License</SelectItem>
                  <SelectItem value="voter">Voter ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DocumentUploadBox label="Address Proof Document" uploaded={addressProofUploaded} onUpload={() => setAddressProofUploaded(true)} />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Bank Details */}
      {step === 2 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Bank Account Details</CardTitle>
            <CardDescription>Where should we send your payouts?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account Holder Name *</Label>
              <Input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="As per bank records" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Account Number *</Label>
                <Input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="XXXX XXXX XXXX" type="password" />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code *</Label>
                <Input value={ifscCode} onChange={e => setIfscCode(e.target.value.toUpperCase())} placeholder="HDFC0001234" maxLength={11} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Input value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. Andheri West" />
              </div>
            </div>
            <Separator />
            <DocumentUploadBox label="Cancelled Cheque / Bank Statement" uploaded={cancelledChequeUploaded} onUpload={() => setCancelledChequeUploaded(true)} />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 3 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Review & Submit</CardTitle>
            <CardDescription>Verify your details before submitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border divide-y">
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">BUSINESS INFORMATION</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Store Name</span>
                  <span className="font-medium">{businessName || "Not provided"}</span>
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{businessType || "Not selected"}</span>
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{category || "Not selected"}</span>
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{email || "Not provided"}</span>
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{city && state ? `${city}, ${state}` : "Not provided"}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">KYC STATUS</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={panNumber ? "default" : "secondary"} className={panNumber ? "bg-primary/10 text-primary border-0" : ""}>
                    PAN: {panNumber || "Missing"}
                  </Badge>
                  <Badge variant={gstNumber ? "default" : "secondary"} className={gstNumber ? "bg-primary/10 text-primary border-0" : ""}>
                    GST: {gstNumber || "Optional"}
                  </Badge>
                  <Badge variant={panUploaded ? "default" : "destructive"} className={panUploaded ? "bg-primary/10 text-primary border-0" : ""}>
                    PAN Doc: {panUploaded ? "✓" : "Missing"}
                  </Badge>
                  <Badge variant={addressProofUploaded ? "default" : "destructive"} className={addressProofUploaded ? "bg-primary/10 text-primary border-0" : ""}>
                    Address Proof: {addressProofUploaded ? "✓" : "Missing"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">BANK DETAILS</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Account Holder</span>
                  <span className="font-medium">{accountName || "Not provided"}</span>
                  <span className="text-muted-foreground">IFSC</span>
                  <span className="font-medium">{ifscCode || "Not provided"}</span>
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">{bankName || "Not provided"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-accent/50 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Approval Process</p>
                <p className="text-xs text-muted-foreground mt-1">
                  After submission, our team will verify your documents within 2-3 business days. 
                  You'll receive an email notification once approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} className="gap-1.5">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
