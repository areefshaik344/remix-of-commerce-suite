import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressFormDialog } from "@/components/shared/AddressFormDialog";
import { User, MapPin, Bell, Shield, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Address } from "@/data/mock-users";

export default function ProfilePage() {
  const { currentUser } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(currentUser?.addresses || []);

  if (!currentUser) return null;

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressDialogOpen(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = (addr: Address) => {
    setAddresses(prev => {
      const exists = prev.find(a => a.id === addr.id);
      if (exists) return prev.map(a => a.id === addr.id ? addr : a);
      return [...prev, addr];
    });
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast({ title: "Address removed" });
  };

  return (
    <div className="container py-6 max-w-3xl">
      <h1 className="font-display text-xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-1"><User className="h-3 w-3" /> Profile</TabsTrigger>
          <TabsTrigger value="addresses" className="gap-1"><MapPin className="h-3 w-3" /> Addresses</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1"><Bell className="h-3 w-3" /> Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1"><Shield className="h-3 w-3" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Personal Information</CardTitle>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => editing ? handleSave() : setEditing(true)}>
                {editing ? <><Save className="h-3 w-3" /> Save</> : <><Edit2 className="h-3 w-3" /> Edit</>}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-display font-bold text-primary">
                  {currentUser.name[0]}
                </div>
                <div>
                  <h3 className="font-display font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">Member since {new Date(currentUser.joinedDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-xs">Full Name</Label><Input defaultValue={currentUser.name} disabled={!editing} className="mt-1" /></div>
                <div><Label className="text-xs">Email</Label><Input defaultValue={currentUser.email} disabled={!editing} className="mt-1" /></div>
                <div><Label className="text-xs">Phone</Label><Input defaultValue={currentUser.phone} disabled={!editing} className="mt-1" /></div>
                <div><Label className="text-xs">Gender</Label><Input defaultValue="Male" disabled={!editing} className="mt-1" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <div className="space-y-3">
            {addresses.map(addr => (
              <Card key={addr.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{addr.name}</span>
                    <Badge variant="outline" className="text-[10px]">{addr.label}</Badge>
                    {addr.isDefault && <Badge className="text-[10px] bg-success/10 text-success border-0">Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.line1}, {addr.line2}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-xs text-muted-foreground mt-1">📞 {addr.phone}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEditAddress(addr)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => handleRemoveAddress(addr.id)}>Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={handleAddAddress}>+ Add New Address</Button>
          </div>
          <AddressFormDialog
            open={addressDialogOpen}
            onOpenChange={setAddressDialogOpen}
            address={editingAddress}
            onSave={handleSaveAddress}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              {["Order updates", "Promotions & deals", "Price drop alerts", "New arrivals"].map(item => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-sm">{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border accent-primary" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              <div><Label className="text-xs">Current Password</Label><Input type="password" placeholder="••••••••" className="mt-1" /></div>
              <div><Label className="text-xs">New Password</Label><Input type="password" placeholder="••••••••" className="mt-1" /></div>
              <div><Label className="text-xs">Confirm New Password</Label><Input type="password" placeholder="••••••••" className="mt-1" /></div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
