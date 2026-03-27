import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { TablePagination, usePagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

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

const severityColors: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

export default function AdminAuditLog() {
  const { data: auditLog, isLoading, error, refetch } = useApiQuery<AuditEntry[]>(() => adminApi.getAuditLog(), []);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = useMemo(() =>
    (auditLog || [])
      .filter(e => severityFilter === "all" || e.severity === severityFilter)
      .filter(e => !search || e.action.includes(search.toLowerCase()) || e.resource.toLowerCase().includes(search.toLowerCase()) || e.actor.toLowerCase().includes(search.toLowerCase())),
    [auditLog, search, severityFilter]
  );

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 10);

  if (isLoading) return <TableSkeleton rows={8} cols={6} />;
  if (error) return <PageError message={error} onRetry={refetch} />;

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
