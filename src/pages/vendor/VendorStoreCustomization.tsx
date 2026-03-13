import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Palette, ImagePlus, Save, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VendorStoreCustomization() {
  const [storeName, setStoreName] = useState("AppleZone Official");
  const [tagline, setTagline] = useState("Authorized Apple Reseller — Premium Products");
  const [description, setDescription] = useState("Your one-stop shop for genuine Apple products. We offer the latest iPhones, MacBooks, iPads, and accessories with official warranty.");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=300&fit=crop");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [showBanner, setShowBanner] = useState(true);
  const [showRating, setShowRating] = useState(true);

  const handleSave = () => {
    toast({ title: "Store customization saved!", description: "Your changes will be visible on your store page." });
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
          <Button className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <Card className="shadow-card overflow-hidden">
        <div className="relative h-36 bg-muted">
          {showBanner && bannerUrl && (
            <img src={bannerUrl} alt="Store banner" className="w-full h-full object-cover" />
          )}
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
        {/* Store Info */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Short tagline for your store" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" /> Branding
            </CardTitle>
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
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Banner</Label>
                <Switch checked={showBanner} onCheckedChange={setShowBanner} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Rating</Label>
                <Switch checked={showRating} onCheckedChange={setShowRating} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
