import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/api/errorMapper";
import { PageError } from "@/shared";

export default function VendorSettings() {
  const { toast } = useToast();
  const { data: vendor, isLoading, error, refetch } = useApiQuery(() => vendorApi.getVendorProfile(), []);
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [gst, setGst] = useState("");
  const [pan, setPan] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");

  useEffect(() => {
    if (vendor) {
      setStoreName(vendor.storeName || "");
      setDescription(vendor.description || "");
      setCategory(vendor.category || "");
      setContactEmail(vendor.contactEmail || vendor.email || "");
      setGst(vendor.gstNumber || "");
      setPan(vendor.panNumber || "");
      setIfsc(vendor.bankIfsc || "");
      setShippingPolicy(vendor.shippingPolicy || "");
      setReturnPolicy(vendor.returnPolicy || "");
    }
  }, [vendor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await vendorApi.updateVendorProfile({
        storeName,
        description,
        category,
        contactEmail,
        gstNumber: gst,
        panNumber: pan,
        bankIfsc: ifsc,
        shippingPolicy,
        returnPolicy,
      });
      toast({ title: "Settings saved", description: "Your store settings have been updated." });
    } catch (err) {
      toast({ title: "Save failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) return <PageError message="Failed to load settings" onRetry={refetch} />;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-xl font-bold">Store Settings</h1>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Store Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">{vendor?.logo || "🏪"}</div>
            <Button variant="outline" size="sm">Change Logo</Button>
          </div>
          <div><Label className="text-xs">Store Name</Label><Input value={storeName} onChange={e => setStoreName(e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs">Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1" rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Category</Label><Input value={category} onChange={e => setCategory(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Contact Email</Label><Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="mt-1" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Business Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label className="text-xs">GST Number</Label><Input value={gst} onChange={e => setGst(e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs">PAN Number</Label><Input value={pan} onChange={e => setPan(e.target.value)} className="mt-1" /></div>
          <div><Label className="text-xs">Bank Account (IFSC)</Label><Input value={ifsc} onChange={e => setIfsc(e.target.value)} className="mt-1" /></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Shipping & Return Policy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label className="text-xs">Shipping Policy</Label><Textarea value={shippingPolicy} onChange={e => setShippingPolicy(e.target.value)} className="mt-1" rows={2} /></div>
          <div><Label className="text-xs">Return Policy</Label><Textarea value={returnPolicy} onChange={e => setReturnPolicy(e.target.value)} className="mt-1" rows={2} /></div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
