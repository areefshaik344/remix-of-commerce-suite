import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { categories } from "@/data/mock-products";
import { vendors } from "@/data/mock-users";

export default function AdminCreateCoupon() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("platform");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const generated = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setCode(generated);
  };

  const handleSubmit = () => {
    if (!code || !value) {
      toast({ title: "Missing fields", description: "Code and discount value are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Coupon created!", description: `Platform coupon "${code}" is now ${active ? "active" : "saved as draft"}.` });
    navigate("/admin/coupons");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/coupons")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="font-display text-xl font-bold">Create Platform Coupon</h1>
          <p className="text-sm text-muted-foreground">Set up a platform-wide discount code</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4"><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4" /> Coupon Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Coupon Code *</Label>
            <div className="flex gap-2">
              <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. PLATFORM25" className="font-mono uppercase" />
              <Button variant="outline" size="sm" onClick={generateCode} className="shrink-0">Generate</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Platform-wide summer sale" />
          </div>

          <div className="space-y-2">
            <Label>Scope</Label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">Platform-wide</SelectItem>
                <SelectItem value="category">Specific Category</SelectItem>
                <SelectItem value="vendor">Specific Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scope === "category" && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.icon} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {scope === "vendor" && (
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.logo} {v.storeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  <SelectItem value="free_shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={type === "percentage" ? "e.g. 25" : "e.g. 500"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Minimum Order (₹)</Label><Input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="0" /></div>
            {type === "percentage" && (
              <div className="space-y-2"><Label>Max Discount (₹)</Label><Input type="number" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} placeholder="No limit" /></div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Total Usage Limit</Label><Input type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} placeholder="Unlimited" /></div>
            <div className="space-y-2"><Label>Per User Limit</Label><Input type="number" value={perUserLimit} onChange={e => setPerUserLimit(e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label className="text-sm">Active immediately</Label>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate("/admin/coupons")}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Coupon</Button>
      </div>
    </div>
  );
}
