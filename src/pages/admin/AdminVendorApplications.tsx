import { useStore, VendorApplication } from "@/store/useStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Store } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function AdminVendorApplications() {
  const { vendorApplications, approveVendor, rejectVendor } = useStore();
  const [approveTarget, setApproveTarget] = useState<VendorApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorApplication | null>(null);
  const [tab, setTab] = useState<"pending" | "all">("pending");

  const filtered = tab === "pending" ? vendorApplications.filter(a => a.status === "pending") : vendorApplications;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Vendor Applications</h1>
        <p className="text-sm text-muted-foreground">
          {vendorApplications.filter(a => a.status === "pending").length} pending review
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === "pending" ? "default" : "outline"} size="sm" onClick={() => setTab("pending")}>
          Pending ({vendorApplications.filter(a => a.status === "pending").length})
        </Button>
        <Button variant={tab === "all" ? "default" : "outline"} size="sm" onClick={() => setTab("all")}>
          All ({vendorApplications.length})
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {tab === "pending" ? "pending " : ""}applications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <Card key={app.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold">{app.storeName}</h3>
                      <Badge variant="secondary" className={`text-xs capitalize border-0 ${statusColors[app.status]}`}>
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                      <span>👤 {app.name}</span>
                      <span>📧 {app.email}</span>
                      <span>📞 {app.phone}</span>
                      <span>📂 {app.category}</span>
                      <span><Clock className="h-3 w-3 inline mr-1" />Applied {app.appliedDate}</span>
                    </div>
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="gap-1 text-success border-success/30 hover:bg-success/10" onClick={() => setApproveTarget(app)}>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setRejectTarget(app)}>
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!approveTarget}
        onOpenChange={() => setApproveTarget(null)}
        title="Approve Application"
        description={`Approve "${approveTarget?.storeName}" by ${approveTarget?.name}? They will be able to start listing products.`}
        confirmLabel="Approve"
        variant="default"
        onConfirm={() => { approveVendor(approveTarget!.id); toast({ title: "Application approved" }); setApproveTarget(null); }}
      />
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={() => setRejectTarget(null)}
        title="Reject Application"
        description={`Reject "${rejectTarget?.storeName}" by ${rejectTarget?.name}? They will be notified via email.`}
        confirmLabel="Reject"
        onConfirm={() => { rejectVendor(rejectTarget!.id); toast({ title: "Application rejected" }); setRejectTarget(null); }}
      />
    </div>
  );
}
