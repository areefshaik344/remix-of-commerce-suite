import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { TablePagination, usePagination } from "@/components/shared/Pagination";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

const mockAuditLog: AuditEntry[] = [
  { id: "al-1", timestamp: "2025-03-10T14:30:00", actor: "Admin User", actorRole: "admin", action: "vendor.approve", resource: "GadgetPro", details: "Approved vendor application", severity: "info" },
  { id: "al-2", timestamp: "2025-03-10T12:15:00", actor: "Admin User", actorRole: "admin", action: "vendor.suspend", resource: "ToyLand", details: "Suspended vendor for policy violation", severity: "critical" },
  { id: "al-3", timestamp: "2025-03-09T18:45:00", actor: "Admin User", actorRole: "admin", action: "product.remove", resource: "Counterfeit Watch", details: "Removed product — counterfeit report", severity: "warning" },
  { id: "al-4", timestamp: "2025-03-09T10:00:00", actor: "Priya Patel", actorRole: "vendor", action: "product.create", resource: "iPhone 16 Case", details: "New product listing created", severity: "info" },
  { id: "al-5", timestamp: "2025-03-08T16:20:00", actor: "Admin User", actorRole: "admin", action: "coupon.create", resource: "SUMMER25", details: "Created 25% off coupon", severity: "info" },
  { id: "al-6", timestamp: "2025-03-08T09:30:00", actor: "Admin User", actorRole: "admin", action: "user.ban", resource: "spam_user@test.com", details: "Banned user for spam reviews", severity: "critical" },
  { id: "al-7", timestamp: "2025-03-07T14:00:00", actor: "Admin User", actorRole: "admin", action: "order.refund", resource: "ORD-10006", details: "Processed refund of ₹6,998", severity: "warning" },
  { id: "al-8", timestamp: "2025-03-07T11:00:00", actor: "Priya Patel", actorRole: "vendor", action: "product.update", resource: "Sony WH-1000XM5", details: "Updated price and stock", severity: "info" },
  { id: "al-9", timestamp: "2025-03-06T15:30:00", actor: "Admin User", actorRole: "admin", action: "category.create", resource: "Pet Supplies", details: "Added new category", severity: "info" },
  { id: "al-10", timestamp: "2025-03-06T08:00:00", actor: "Admin User", actorRole: "admin", action: "settings.update", resource: "Commission", details: "Updated commission rate to 12%", severity: "warning" },
];

const severityColors: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function AdminAuditLog() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = useMemo(() =>
    mockAuditLog
      .filter(e => severityFilter === "all" || e.severity === severityFilter)
      .filter(e => !search || e.action.includes(search.toLowerCase()) || e.resource.toLowerCase().includes(search.toLowerCase()) || e.actor.toLowerCase().includes(search.toLowerCase())),
    [search, severityFilter]
  );

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 10);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Activity history across the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions, resources, actors..." className="pl-9" />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Timestamp</th>
                  <th className="text-left p-3 font-medium">Actor</th>
                  <th className="text-left p-3 font-medium">Action</th>
                  <th className="text-left p-3 font-medium">Resource</th>
                  <th className="text-left p-3 font-medium">Details</th>
                  <th className="text-center p-3 font-medium">Severity</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(entry => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(entry.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <span className="font-medium">{entry.actor}</span>
                        <Badge variant="outline" className="ml-2 text-[10px]">{entry.actorRole}</Badge>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs">{entry.action}</td>
                    <td className="p-3 font-medium">{entry.resource}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{entry.details}</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className={`text-xs capitalize border-0 ${severityColors[entry.severity]}`}>{entry.severity}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
