import { useNavigate, useParams } from "react-router-dom";
import { users, vendors } from "@/data/mock-users";
import { orders } from "@/data/mock-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, ShoppingCart, Ban, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminUserDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = users.find(u => u.id === id);
  const vendor = vendors.find(v => v.userId === id);
  const userOrders = orders.filter(o => o.userId === id);

  if (!user) {
    return <div className="flex items-center justify-center h-64"><div className="text-center"><p className="text-lg font-medium">User not found</p><Button variant="link" onClick={() => navigate("/admin/users")}>Back</Button></div></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">User profile and activity</p>
        </div>
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">{user.role}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{user.name[0]}</div>
                <p className="mt-3 font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{user.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{user.phone}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />Joined {new Date(user.joinedDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast({ title: "Password reset email sent" })}><Shield className="h-4 w-4" /> Reset Password</Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={() => toast({ title: "User suspended", variant: "destructive" })}><Ban className="h-4 w-4" /> Suspend Account</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {user.addresses && user.addresses.length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Addresses</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {user.addresses.map(addr => (
                  <div key={addr.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1"><span className="font-medium text-sm">{addr.label}</span>{addr.isDefault && <Badge variant="secondary" className="text-[10px]">Default</Badge>}</div>
                    <p className="text-sm text-muted-foreground">{addr.line1}, {addr.line2}</p>
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {vendor && (
            <Card className="shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base">Vendor Profile</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Store</span><span className="font-medium">{vendor.storeName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{vendor.category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Products</span><span>{vendor.totalProducts}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span>₹{(vendor.totalRevenue / 100000).toFixed(1)}L</span></div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Recent Orders ({userOrders.length})</CardTitle></CardHeader>
            <CardContent>
              {userOrders.length === 0 ? <p className="text-sm text-muted-foreground">No orders found.</p> : (
                <div className="space-y-2">
                  {userOrders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div><p className="font-mono text-sm font-medium">{o.id}</p><p className="text-xs text-muted-foreground">{o.items.map(i => i.productName).join(", ")}</p></div>
                      <div className="text-right"><p className="font-medium text-sm">₹{o.total.toLocaleString("en-IN")}</p><Badge variant="secondary" className="text-[10px] capitalize">{o.status}</Badge></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
