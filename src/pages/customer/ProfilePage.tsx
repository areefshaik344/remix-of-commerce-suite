import { useState } from "react";
import { useStore } from "@/store/useStore";
import { users } from "@/data/mock-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Bell, Shield, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { isAuthenticated, login } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  if (!isAuthenticated) login("customer");
  const customer = users[0];
  const addresses = customer.addresses || [];

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
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
                  {customer.name[0]}
                </div>
                <div>
                  <h3 className="font-display font-semibold">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">Member since {new Date(customer.joinedDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-xs">Full Name</Label><Input defaultValue={customer.name} disabled={!editing} className="mt-1" /></div>
                <div><Label className="text-xs">Email</Label><Input defaultValue={customer.email} disabled={!editing} className="mt-1" /></div>
                <div><Label className="text-xs">Phone</Label><Input defaultValue={customer.phone} disabled={!editing} className="mt-1" /></div>
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
                    <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive">Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full">+ Add New Address</Button>
          </div>
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
