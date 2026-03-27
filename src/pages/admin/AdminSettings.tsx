import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/api/errorMapper";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settingsResp, isLoading, error } = useApiQuery(() => adminApi.getSettings(), []);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    if (settingsResp) setSettings(settingsResp);
  }, [settingsResp]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load settings" />;

  const update = (key: string, val: any) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Failed to save", description: getErrorMessage(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Info</CardTitle>
              <CardDescription>Basic marketplace configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Platform Name</Label><Input value={settings.platformName || ""} onChange={e => update("platformName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Support Email</Label><Input value={settings.supportEmail || ""} onChange={e => update("supportEmail", e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select value={settings.currency || "inr"} onValueChange={v => update("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone || "ist"} onValueChange={v => update("timezone", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div><Label>Maintenance Mode</Label><p className="text-xs text-muted-foreground">Take the platform offline for maintenance</p></div>
                <Switch checked={settings.maintenanceMode || false} onCheckedChange={v => update("maintenanceMode", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Vendor Registration</Label><p className="text-xs text-muted-foreground">Allow new vendors to register</p></div>
                <Switch checked={settings.vendorRegistration ?? true} onCheckedChange={v => update("vendorRegistration", v)} />
              </div>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Payment Settings</CardTitle><CardDescription>Configure payment gateways and commission</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Platform Commission (%)</Label><Input type="number" value={settings.commission || ""} onChange={e => update("commission", e.target.value)} /></div>
                <div className="space-y-2"><Label>Minimum Payout (₹)</Label><Input type="number" value={settings.minPayout || ""} onChange={e => update("minPayout", e.target.value)} /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><div><Label>Razorpay</Label><p className="text-xs text-muted-foreground">Accept payments via Razorpay</p></div><Switch checked={settings.razorpay ?? true} onCheckedChange={v => update("razorpay", v)} /></div>
              <div className="flex items-center justify-between"><div><Label>Cash on Delivery</Label><p className="text-xs text-muted-foreground">Allow COD for orders</p></div><Switch checked={settings.cod ?? true} onCheckedChange={v => update("cod", v)} /></div>
              <div className="flex items-center justify-between"><div><Label>UPI Payments</Label><p className="text-xs text-muted-foreground">Direct UPI payment support</p></div><Switch checked={settings.upi ?? true} onCheckedChange={v => update("upi", v)} /></div>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Tax Configuration</CardTitle><CardDescription>Set GST and tax rules for the platform</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Default GST Rate (%)</Label><Input type="number" value={settings.defaultGstRate || ""} onChange={e => update("defaultGstRate", e.target.value)} /></div>
                <div className="space-y-2"><Label>Platform GSTIN</Label><Input value={settings.gstin || ""} onChange={e => update("gstin", e.target.value)} /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><div><Label>Include Tax in Display Price</Label><p className="text-xs text-muted-foreground">Show prices inclusive of GST</p></div><Switch checked={settings.taxInclusive ?? true} onCheckedChange={v => update("taxInclusive", v)} /></div>
              <div className="flex items-center justify-between"><div><Label>Auto-generate Tax Invoices</Label><p className="text-xs text-muted-foreground">Automatically create GST invoices for each order</p></div><Switch checked={settings.autoInvoice ?? true} onCheckedChange={v => update("autoInvoice", v)} /></div>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Tax Settings"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Shipping Configuration</CardTitle><CardDescription>Default shipping rules and providers</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Free Shipping Threshold (₹)</Label><Input type="number" value={settings.freeShippingThreshold || ""} onChange={e => update("freeShippingThreshold", e.target.value)} /></div>
                <div className="space-y-2"><Label>Default Shipping Fee (₹)</Label><Input type="number" value={settings.defaultShippingFee || ""} onChange={e => update("defaultShippingFee", e.target.value)} /></div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><div><Label>Express Delivery</Label><p className="text-xs text-muted-foreground">Offer same-day/next-day delivery option</p></div><Switch checked={settings.expressDelivery ?? true} onCheckedChange={v => update("expressDelivery", v)} /></div>
              <div className="flex items-center justify-between"><div><Label>International Shipping</Label><p className="text-xs text-muted-foreground">Enable cross-border shipping</p></div><Switch checked={settings.internationalShipping ?? false} onCheckedChange={v => update("internationalShipping", v)} /></div>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle><CardDescription>Configure email and push notification triggers</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "notifyNewOrder", label: "New Order", desc: "Notify vendor on new order" },
                { key: "notifyStatusUpdate", label: "Order Status Update", desc: "Notify customer on status change" },
                { key: "notifyNewVendor", label: "New Vendor Registration", desc: "Notify admin on new vendor signup" },
                { key: "notifyLowStock", label: "Low Stock Alert", desc: "Alert vendor when stock is low" },
                { key: "notifyReview", label: "Review Posted", desc: "Notify vendor of new reviews" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between">
                  <div><Label>{n.label}</Label><p className="text-xs text-muted-foreground">{n.desc}</p></div>
                  <Switch checked={settings[n.key] ?? true} onCheckedChange={v => update(n.key, v)} />
                </div>
              ))}
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
