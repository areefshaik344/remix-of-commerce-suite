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
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { getErrorMessage } from "@/api/errorMapper";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string;
  enabled: boolean;
  variables: string[];
}

export default function AdminEmailTemplates() {
  const { data: templatesResp, isLoading, error, refetch } = useApiQuery(
    () => adminApi.getEmailTemplates(), []
  );
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [saving, setSaving] = useState(false);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load email templates" />;

  const templates: EmailTemplate[] = Array.isArray(templatesResp) ? templatesResp : [];

  const toggleTemplate = async (tmpl: EmailTemplate) => {
    try {
      await adminApi.updateEmailTemplate(tmpl.id, { ...tmpl, enabled: !tmpl.enabled } as unknown as Record<string, unknown>);
      toast({ title: "Template updated" });
      refetch();
    } catch (e) {
      toast({ title: "Failed to update", description: getErrorMessage(e), variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!editingTemplate) return;
    setSaving(true);
    try {
      await adminApi.updateEmailTemplate(editingTemplate.id, editingTemplate as unknown as Record<string, unknown>);
      toast({ title: "Template saved" });
      setEditingTemplate(null);
      refetch();
    } catch (e) {
      toast({ title: "Failed to save", description: getErrorMessage(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
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
                      {(tmpl.variables || []).map(v => (
                        <Badge key={v} variant="secondary" className="text-[10px]">{`{{${v}}}`}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={tmpl.enabled} onCheckedChange={() => toggleTemplate(tmpl)} />
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

      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Template</DialogTitle></DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Template Name</Label><Input value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Subject Line</Label><Input value={editingTemplate.subject} onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} /></div>
              <div className="space-y-2"><Label>Body</Label><Textarea value={editingTemplate.body} onChange={e => setEditingTemplate({ ...editingTemplate, body: e.target.value })} rows={8} className="font-mono text-xs" /></div>
              <div className="flex gap-1 flex-wrap">
                {(editingTemplate.variables || []).map(v => (
                  <Badge key={v} variant="outline" className="text-xs cursor-pointer" onClick={() => setEditingTemplate({ ...editingTemplate, body: editingTemplate.body + `{{${v}}}` })}>
                    + {`{{${v}}}`}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Template"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
