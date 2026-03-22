import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Address } from "@/features/auth";

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  onSave: (address: Address) => void;
}

const states = [
  "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu", "Delhi",
  "Gujarat", "Rajasthan", "West Bengal", "Kerala", "Uttar Pradesh",
];

export function AddressFormDialog({ open, onOpenChange, address, onSave }: AddressFormDialogProps) {
  const isEditing = !!address;
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    line1: address?.line1 || "",
    line2: address?.line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    label: address?.label || "Home",
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      id: address?.id || `a-${Date.now()}`,
      ...form,
    };
    onSave(newAddress);
    toast({ title: isEditing ? "Address updated" : "Address added", description: "Your address has been saved." });
    onOpenChange(false);
  };

  const update = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input value={form.name} onChange={e => update("name", e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={e => update("phone", e.target.value)} className="mt-1" required />
            </div>
          </div>
          <div>
            <Label className="text-xs">Address Line 1</Label>
            <Input placeholder="House/Flat/Office No." value={form.line1} onChange={e => update("line1", e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label className="text-xs">Address Line 2</Label>
            <Input placeholder="Street, Landmark" value={form.line2} onChange={e => update("line2", e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">City</Label>
              <Input value={form.city} onChange={e => update("city", e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label className="text-xs">State</Label>
              <Select value={form.state} onValueChange={v => update("state", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Pincode</Label>
              <Input value={form.pincode} onChange={e => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} className="mt-1" required />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <Label className="text-xs">Label</Label>
              <Select value={form.label} onValueChange={v => update("label", v)}>
                <SelectTrigger className="mt-1 w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer">
              <Checkbox checked={form.isDefault} onCheckedChange={v => update("isDefault", v === true)} />
              Set as default
            </label>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? "Update Address" : "Save Address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
