import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
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
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="MarketHub" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@markethub.com" />
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="inr">
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
                  <Select defaultValue="ist">
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
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Take the platform offline for maintenance</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Vendor Registration</Label>
                  <p className="text-xs text-muted-foreground">Allow new vendors to register</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Settings</CardTitle>
              <CardDescription>Configure payment gateways and commission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Commission (%)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Payout (₹)</Label>
                  <Input type="number" defaultValue="500" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Razorpay</Label>
                  <p className="text-xs text-muted-foreground">Accept payments via Razorpay</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cash on Delivery</Label>
                  <p className="text-xs text-muted-foreground">Allow COD for orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>UPI Payments</Label>
                  <p className="text-xs text-muted-foreground">Direct UPI payment support</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping Configuration</CardTitle>
              <CardDescription>Default shipping rules and providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Free Shipping Threshold (₹)</Label>
                  <Input type="number" defaultValue="499" />
                </div>
                <div className="space-y-2">
                  <Label>Default Shipping Fee (₹)</Label>
                  <Input type="number" defaultValue="49" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Express Delivery</Label>
                  <p className="text-xs text-muted-foreground">Offer same-day/next-day delivery option</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>International Shipping</Label>
                  <p className="text-xs text-muted-foreground">Enable cross-border shipping</p>
                </div>
                <Switch />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Configure email and push notification triggers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "New Order", desc: "Notify vendor on new order" },
                { label: "Order Status Update", desc: "Notify customer on status change" },
                { label: "New Vendor Registration", desc: "Notify admin on new vendor signup" },
                { label: "Low Stock Alert", desc: "Alert vendor when stock is low" },
                { label: "Review Posted", desc: "Notify vendor of new reviews" },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <Label>{n.label}</Label>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
