import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { vendors } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";

export default function VendorSettings() {
  const vendor = vendors[0];
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your store settings have been updated." });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-xl font-bold">Store Settings</h1>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Store Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">{vendor.logo}</div>
            <Button variant="outline" size="sm">Change Logo</Button>
          </div>
          <div><Label className="text-xs">Store Name</Label><Input defaultValue={vendor.storeName} className="mt-1" /></div>
          <div><Label className="text-xs">Description</Label><Textarea defaultValue={vendor.description} className="mt-1" rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Category</Label><Input defaultValue={vendor.category} className="mt-1" /></div>
            <div><Label className="text-xs">Contact Email</Label><Input defaultValue="priya@vendor.com" className="mt-1" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Business Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label className="text-xs">GST Number</Label><Input defaultValue="29AABCU9603R1ZM" className="mt-1" /></div>
          <div><Label className="text-xs">PAN Number</Label><Input defaultValue="AABCU9603R" className="mt-1" /></div>
          <div><Label className="text-xs">Bank Account (IFSC)</Label><Input defaultValue="HDFC0001234" className="mt-1" /></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Shipping & Return Policy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label className="text-xs">Shipping Policy</Label><Textarea defaultValue="Free shipping on orders above ₹499. Standard delivery in 3-5 business days." className="mt-1" rows={2} /></div>
          <div><Label className="text-xs">Return Policy</Label><Textarea defaultValue="7-day easy returns on all products. Refund processed within 5-7 business days." className="mt-1" rows={2} /></div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">Save Changes</Button>
    </div>
  );
}
