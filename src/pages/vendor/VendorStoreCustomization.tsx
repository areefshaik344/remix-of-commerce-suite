import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Palette, ImagePlus, Save, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { getErrorMessage } from "@/api/errorMapper";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";

export default function VendorStoreCustomization() {
  const { data: storeResp, isLoading, error } = useApiQuery(() => vendorApi.getStoreCustomization(), []);

  const [storeName, setStoreName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [showBanner, setShowBanner] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (storeResp) {
      setStoreName(storeResp.storeName || "");
      setTagline(storeResp.tagline || "");
      setDescription(storeResp.description || "");
      setBannerUrl(storeResp.bannerUrl || "");
      setLogoUrl(storeResp.logoUrl || "");
      setPrimaryColor(storeResp.primaryColor || "#3B82F6");
      setShowBanner(storeResp.showBanner ?? true);
      setShowRating(storeResp.showRating ?? true);
    }
  }, [storeResp]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load store customization" />;

  const handleSave = async () => {
    setSaving(true);
    try {
      await vendorApi.updateStoreCustomization({ storeName, tagline, description, bannerUrl, logoUrl, primaryColor, showBanner, showRating });
      toast({ title: "Store customization saved!", description: "Your changes will be visible on your store page." });
    } catch (e) {
      toast({ title: "Failed to save", description: getErrorMessage(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Store Customization</h1>
          <p className="text-sm text-muted-foreground">Customize how your store appears to customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.open("/store/applezone-official", "_blank")}>
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button className="gap-2" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card className="shadow-card overflow-hidden">
        <div className="relative h-36 bg-muted">
          {showBanner && bannerUrl && <img src={bannerUrl} alt="Store banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl bg-card flex items-center justify-center text-2xl shadow-elevated" style={{ borderColor: primaryColor, borderWidth: 2 }}>
              {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full rounded-xl object-cover" /> : "🍎"}
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">{storeName}</h2>
              <p className="text-white/80 text-xs">{tagline}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="text-base">Store Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Store Name</Label><Input value={storeName} onChange={e => setStoreName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Short tagline for your store" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4" /> Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Image URL</Label>
              <div className="flex gap-2">
                <Input value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} placeholder="https://..." className="flex-1" />
                <Button variant="outline" size="icon"><ImagePlus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Logo Image URL</Label>
              <div className="flex gap-2">
                <Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." className="flex-1" />
                <Button variant="outline" size="icon"><ImagePlus className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-10 w-14 rounded border cursor-pointer" />
                <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-28 font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between"><Label className="text-sm">Show Banner</Label><Switch checked={showBanner} onCheckedChange={setShowBanner} /></div>
              <div className="flex items-center justify-between"><Label className="text-sm">Show Rating</Label><Switch checked={showRating} onCheckedChange={setShowRating} /></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
