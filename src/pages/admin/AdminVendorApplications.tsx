import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Store } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function AdminVendorApplications() {
  const { data: applications, isLoading, error, refetch } = useApiQuery<any[]>(() => adminApi.getVendorApplications(), []);
  const [approveTarget, setApproveTarget] = useState<any | null>(null);
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [tab, setTab] = useState<"pending" | "all">("pending");

  if (isLoading) return <TableSkeleton rows={4} cols={5} />;
  if (error) return <PageError message={error} onRetry={refetch} />;

  const appList = applications || [];
  const filtered = tab === "pending" ? appList.filter((a: any) => a.status === "pending") : appList;
  const pendingCount = appList.filter((a: any) => a.status === "pending").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Vendor Applications</h1>
        <p className="text-sm text-muted-foreground">{pendingCount} pending review</p>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === "pending" ? "default" : "outline"} size="sm" onClick={() => setTab("pending")}>
          Pending ({pendingCount})
        </Button>
        <Button variant={tab === "all" ? "default" : "outline"} size="sm" onClick={() => setTab("all")}>
          All ({appList.length})
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
          {filtered.map((app: any) => (
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
        onConfirm={async () => {
          await adminApi.approveVendorApplication(approveTarget!.id);
          toast({ title: "Application approved" });
          setApproveTarget(null);
          refetch();
        }}
      />
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={() => setRejectTarget(null)}
        title="Reject Application"
        description={`Reject "${rejectTarget?.storeName}" by ${rejectTarget?.name}? They will be notified via email.`}
        confirmLabel="Reject"
        onConfirm={async () => {
          await adminApi.rejectVendorApplication(rejectTarget!.id);
          toast({ title: "Application rejected" });
          setRejectTarget(null);
          refetch();
        }}
      />
    </div>
  );
}
