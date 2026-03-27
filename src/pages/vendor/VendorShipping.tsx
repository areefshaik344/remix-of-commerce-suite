import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, MapPin, Clock, IndianRupee, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { getErrorMessage } from "@/api/errorMapper";
import { PageError } from "@/shared";

export default function VendorShipping() {
  const { toast } = useToast();
  const { data: settings, isLoading, error, refetch } = useApiQuery(() => vendorApi.getShippingSettings(), []);
  const [saving, setSaving] = useState(false);

  const [logisticsMode, setLogisticsMode] = useState("marketplace");
  const [expressEnabled, setExpressEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("499");
  const [handlingDays, setHandlingDays] = useState("1");
  const [defaultWeight, setDefaultWeight] = useState("500");
  const [returnShipping, setReturnShipping] = useState("seller");

  useEffect(() => {
    if (settings) {
      setLogisticsMode(settings.logisticsMode || "marketplace");
      setExpressEnabled(settings.expressEnabled ?? true);
      setCodEnabled(settings.codEnabled ?? true);
      setFreeShippingThreshold(String(settings.freeShippingThreshold ?? 499));
      setHandlingDays(String(settings.handlingDays ?? 1));
      setDefaultWeight(String(settings.defaultWeight ?? 500));
      setReturnShipping(settings.returnShipping || "seller");
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await vendorApi.updateShippingSettings({
        logisticsMode,
        expressEnabled,
        codEnabled,
        freeShippingThreshold: parseFloat(freeShippingThreshold),
        handlingDays: parseInt(handlingDays),
        defaultWeight: parseFloat(defaultWeight),
        returnShipping,
      });
      toast({ title: "Shipping settings saved", description: "Your shipping configuration has been updated." });
    } catch (err) {
      toast({ title: "Save failed", description: getErrorMessage(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) return <PageError message="Failed to load shipping settings" onRetry={refetch} />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-xl font-bold">Shipping & Logistics</h1>
        <p className="text-sm text-muted-foreground">Configure how your products are shipped</p>
      </div>

      {/* Logistics Mode */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4" /> Logistics Partner</CardTitle>
          <CardDescription>Choose who handles your shipping</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={logisticsMode} onValueChange={setLogisticsMode} className="space-y-3">
            <div className={`flex items-start gap-3 rounded-lg border-2 p-4 transition-colors cursor-pointer ${logisticsMode === "marketplace" ? "border-primary bg-primary/5" : "border-border"}`}>
              <RadioGroupItem value="marketplace" id="marketplace" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="marketplace" className="font-medium cursor-pointer">Marketplace Logistics</Label>
                <p className="text-xs text-muted-foreground mt-1">We handle pickup, packing, and delivery. Lower effort for you with pan-India coverage.</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-xs">Pan-India</Badge>
                  <Badge variant="secondary" className="text-xs">Auto-pickup</Badge>
                  <Badge variant="secondary" className="text-xs">Tracking included</Badge>
                </div>
              </div>
            </div>
            <div className={`flex items-start gap-3 rounded-lg border-2 p-4 transition-colors cursor-pointer ${logisticsMode === "self" ? "border-primary bg-primary/5" : "border-border"}`}>
              <RadioGroupItem value="self" id="self" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="self" className="font-medium cursor-pointer">Self-Shipping</Label>
                <p className="text-xs text-muted-foreground mt-1">You manage your own courier partners and ship directly. More control over delivery experience.</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-xs">Full control</Badge>
                  <Badge variant="secondary" className="text-xs">Custom packaging</Badge>
                </div>
              </div>
            </div>
            <div className={`flex items-start gap-3 rounded-lg border-2 p-4 transition-colors cursor-pointer ${logisticsMode === "hybrid" ? "border-primary bg-primary/5" : "border-border"}`}>
              <RadioGroupItem value="hybrid" id="hybrid" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="hybrid" className="font-medium cursor-pointer">Hybrid</Label>
                <p className="text-xs text-muted-foreground mt-1">Use marketplace logistics for some zones and self-ship for local / priority orders.</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-xs">Flexible</Badge>
                  <Badge variant="secondary" className="text-xs">Cost-optimized</Badge>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Shipping Rules */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><IndianRupee className="h-4 w-4" /> Shipping Rates</CardTitle>
          <CardDescription>Set pricing rules for delivery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Free Shipping Above (₹)</Label>
              <Input type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Default Package Weight (g)</Label>
              <Input type="number" value={defaultWeight} onChange={e => setDefaultWeight(e.target.value)} />
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Express Delivery</Label>
                <p className="text-xs text-muted-foreground">Offer same-day / next-day delivery</p>
              </div>
              <Switch checked={expressEnabled} onCheckedChange={setExpressEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Cash on Delivery</Label>
                <p className="text-xs text-muted-foreground">Accept COD orders (₹20 extra charge)</p>
              </div>
              <Switch checked={codEnabled} onCheckedChange={setCodEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Processing & Handling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Handling Time (days)</Label>
              <Select value={handlingDays} onValueChange={setHandlingDays}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Same day</SelectItem>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Return Shipping Paid By</Label>
              <Select value={returnShipping} onValueChange={setReturnShipping}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Address */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Pickup Address</CardTitle>
          <CardDescription>Where should couriers pick up orders?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{settings?.pickupAddress?.name || "Warehouse"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{settings?.pickupAddress?.address || "Configure your pickup address"}</p>
              <p className="text-xs text-muted-foreground">{settings?.pickupAddress?.phone || ""}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto shrink-0">Edit</Button>
          </div>
          <Button variant="outline" size="sm">+ Add Another Pickup Location</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" disabled={saving}>{saving ? "Saving..." : "Save Shipping Settings"}</Button>
    </div>
  );
}
