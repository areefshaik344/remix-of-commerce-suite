import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Edit2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string;
  enabled: boolean;
  variables: string[];
}

const mockTemplates: EmailTemplate[] = [
  { id: "et-1", name: "Welcome Email", subject: "Welcome to MarketHub, {{name}}!", body: "Hi {{name}},\n\nWelcome to MarketHub! Start exploring thousands of products from verified sellers.\n\nHappy shopping!\nTeam MarketHub", trigger: "User Signup", enabled: true, variables: ["name", "email"] },
  { id: "et-2", name: "Order Confirmation", subject: "Order #{{orderId}} Confirmed", body: "Hi {{name}},\n\nYour order #{{orderId}} has been confirmed!\n\nTotal: ₹{{total}}\nItems: {{items}}\n\nWe'll notify you when it ships.", trigger: "Order Placed", enabled: true, variables: ["name", "orderId", "total", "items"] },
  { id: "et-3", name: "Order Shipped", subject: "Your order #{{orderId}} has shipped!", body: "Hi {{name}},\n\nYour order is on its way!\n\nTracking ID: {{trackingId}}\nEstimated delivery: {{eta}}", trigger: "Order Shipped", enabled: true, variables: ["name", "orderId", "trackingId", "eta"] },
  { id: "et-4", name: "Password Reset", subject: "Reset your MarketHub password", body: "Hi {{name}},\n\nClick the link below to reset your password:\n\n{{resetLink}}\n\nThis link expires in 1 hour.", trigger: "Password Reset Request", enabled: true, variables: ["name", "resetLink"] },
  { id: "et-5", name: "Vendor Approved", subject: "Your store is live on MarketHub!", body: "Hi {{name}},\n\nCongratulations! Your store '{{storeName}}' has been approved.\n\nYou can now start listing products.", trigger: "Vendor Application Approved", enabled: true, variables: ["name", "storeName"] },
  { id: "et-6", name: "Review Reminder", subject: "How was your {{productName}}?", body: "Hi {{name}},\n\nYou recently received {{productName}}. We'd love to hear your thoughts!\n\nLeave a review to help other shoppers.", trigger: "7 Days After Delivery", enabled: false, variables: ["name", "productName", "productUrl"] },
];

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const toggleTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    toast({ title: "Template updated" });
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setEditingTemplate(null);
    toast({ title: "Template saved" });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Email Templates</h1>
        <p className="text-sm text-muted-foreground">Manage automated email notifications</p>
      </div>

      <div className="grid gap-3">
        {templates.map(tmpl => (
          <Card key={tmpl.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{tmpl.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{tmpl.trigger}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Subject: {tmpl.subject}</p>
                    <div className="flex gap-1 mt-1">
                      {tmpl.variables.map(v => (
                        <Badge key={v} variant="secondary" className="text-[10px]">{`{{${v}}}`}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={tmpl.enabled} onCheckedChange={() => toggleTemplate(tmpl.id)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewTemplate(tmpl)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingTemplate({ ...tmpl })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Template</DialogTitle></DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Template Name</Label><Input value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Subject Line</Label><Input value={editingTemplate.subject} onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} /></div>
              <div className="space-y-2"><Label>Body</Label><Textarea value={editingTemplate.body} onChange={e => setEditingTemplate({ ...editingTemplate, body: e.target.value })} rows={8} className="font-mono text-xs" /></div>
              <div className="flex gap-1 flex-wrap">
                {editingTemplate.variables.map(v => (
                  <Badge key={v} variant="outline" className="text-xs cursor-pointer" onClick={() => setEditingTemplate({ ...editingTemplate, body: editingTemplate.body + `{{${v}}}` })}>
                    + {`{{${v}}}`}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save Template</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Email Preview</DialogTitle></DialogHeader>
          {previewTemplate && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Subject:</p>
              <p className="font-medium text-sm mb-4">{previewTemplate.subject.replace(/\{\{(\w+)\}\}/g, (_, k) => `[${k}]`)}</p>
              <p className="text-xs text-muted-foreground mb-1">Body:</p>
              <pre className="text-sm whitespace-pre-wrap font-sans">{previewTemplate.body.replace(/\{\{(\w+)\}\}/g, (_, k) => `[${k}]`)}</pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
