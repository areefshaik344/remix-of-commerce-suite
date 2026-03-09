import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ImagePlus, X, Save, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const existingBanners: Record<string, any> = {
  "1": { title: "Summer Sale - Up to 70% Off", subtitle: "Huge discounts on electronics, fashion & more", position: "hero", link: "/products?sale=summer", active: true, image: "/placeholder.svg", startDate: "2025-01-01", endDate: "2025-03-31" },
  "2": { title: "New Arrivals Collection", subtitle: "Check out the latest trends", position: "hero", link: "/products?collection=new", active: true, image: "/placeholder.svg", startDate: "2025-02-01", endDate: "2025-04-30" },
};

export default function AdminBannerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const existing = id ? existingBanners[id] : null;

  const [title, setTitle] = useState(existing?.title || "");
  const [subtitle, setSubtitle] = useState(existing?.subtitle || "");
  const [position, setPosition] = useState(existing?.position || "hero");
  const [link, setLink] = useState(existing?.link || "");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [active, setActive] = useState(existing?.active ?? true);
  const [image, setImage] = useState<string | null>(existing?.image || null);
  const [startDate, setStartDate] = useState(existing?.startDate || "");
  const [endDate, setEndDate] = useState(existing?.endDate || "");
  const [desktopImage, setDesktopImage] = useState<string | null>(existing?.image || null);
  const [mobileImage, setMobileImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#ffffff");

  const simulateUpload = (setter: (v: string) => void) => {
    setter("https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop");
  };

  const handleSubmit = () => {
    if (!title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Banner updated" : "Banner created", description: `"${title}" has been ${isEdit ? "saved" : "created"}.` });
    navigate("/admin/cms");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cms")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="font-display text-xl font-bold">{isEdit ? "Edit Banner" : "Create Banner"}</h1>
          <p className="text-sm text-muted-foreground">{isEdit ? "Update banner content and settings" : "Set up a new promotional banner"}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-4"><CardTitle className="text-base">Banner Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Sale - 70% Off" /></div>
              <div className="space-y-2"><Label>Subtitle</Label><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Shop electronics, fashion & more" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>CTA Button Text</Label><Input value={ctaText} onChange={e => setCtaText(e.target.value)} /></div>
                <div className="space-y-2"><Label>Link URL</Label><Input value={link} onChange={e => setLink(e.target.value)} placeholder="/products?sale=summer" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-4"><CardTitle className="text-base">Banner Images</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Desktop Image (1200×400)</Label>
                {desktopImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={desktopImage} alt="Desktop" className="w-full h-32 object-cover" />
                    <button onClick={() => setDesktopImage(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button onClick={() => simulateUpload(setDesktopImage)} className="w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ImagePlus className="h-6 w-6" /><span className="text-xs font-medium">Upload Desktop Image</span>
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <Label>Mobile Image (600×300) - Optional</Label>
                {mobileImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-border max-w-[200px]">
                    <img src={mobileImage} alt="Mobile" className="w-full h-24 object-cover" />
                    <button onClick={() => setMobileImage(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button onClick={() => simulateUpload(setMobileImage)} className="w-48 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/50 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <ImagePlus className="h-5 w-5" /><span className="text-[10px] font-medium">Upload Mobile</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden relative h-32" style={{ backgroundColor: bgColor }}>
                {desktopImage && <img src={desktopImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                <div className="relative z-10 flex flex-col justify-center h-full px-6" style={{ color: textColor }}>
                  <p className="text-lg font-bold">{title || "Banner Title"}</p>
                  <p className="text-sm opacity-80">{subtitle || "Banner subtitle text"}</p>
                  {ctaText && <Button size="sm" className="mt-2 w-fit" variant="secondary">{ctaText}</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-4"><CardTitle className="text-base">Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Carousel</SelectItem>
                    <SelectItem value="top-bar">Top Bar</SelectItem>
                    <SelectItem value="mid-page">Mid-Page</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-xs">Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div className="space-y-2"><Label className="text-xs">End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
              </div>
              <div className="flex items-center justify-between pt-2"><Label className="text-sm">Active</Label><Switch checked={active} onCheckedChange={setActive} /></div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-4"><CardTitle className="text-base">Styling</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3"><Label className="text-sm w-24">Background</Label><Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-8 p-0.5" /><span className="text-xs text-muted-foreground font-mono">{bgColor}</span></div>
              <div className="flex items-center gap-3"><Label className="text-sm w-24">Text Color</Label><Input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-8 p-0.5" /><span className="text-xs text-muted-foreground font-mono">{textColor}</span></div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" onClick={handleSubmit}><Save className="h-4 w-4 mr-1.5" /> {isEdit ? "Save Changes" : "Create Banner"}</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/admin/cms")}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
