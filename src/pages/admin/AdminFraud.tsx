import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, ShieldAlert, MessageSquareWarning, Eye, Ban, Check, MoreHorizontal, Star, Flag, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { getErrorMessage } from "@/api/errorMapper";

export default function AdminFraud() {
  const { toast } = useToast();

  const { data: ordersResp, isLoading: oLoading, error: oError, refetch: refetchOrders } = useApiQuery(
    () => adminApi.getFraudOrders(), []
  );
  const { data: reviewsResp, isLoading: rLoading, error: rError } = useApiQuery(
    () => adminApi.getFraudReviews(), []
  );
  const { data: reportsResp, isLoading: rpLoading, error: rpError } = useApiQuery(
    () => adminApi.getFraudReports(), []
  );

  const isLoading = oLoading || rLoading || rpLoading;
  const error = oError || rError || rpError;
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load fraud data" />;

  const suspiciousOrders: any[] = Array.isArray(ordersResp) ? ordersResp : [];
  const fakeReviews: any[] = Array.isArray(reviewsResp) ? reviewsResp : [];
  const abuseReports: any[] = Array.isArray(reportsResp) ? reportsResp : [];

  const handleAction = async (action: string, id: string) => {
    try {
      await adminApi.takeFraudAction(id, action);
      toast({ title: `${action}`, description: `Action taken on ${id}` });
      refetchOrders();
    } catch (e) {
      toast({ title: "Action failed", description: getErrorMessage(e), variant: "destructive" });
    }
  };

  const riskBadge = (level: string) => {
    const map: Record<string, { className: string }> = {
      high: { className: "bg-destructive/10 text-destructive border-0" },
      medium: { className: "bg-warning/10 text-warning border-0" },
      low: { className: "bg-primary/10 text-primary border-0" },
    };
    return <Badge className={`text-xs capitalize ${map[level]?.className}`}>{level} risk</Badge>;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-secondary text-secondary-foreground",
      investigating: "bg-warning/10 text-warning border-0",
      action_taken: "bg-primary/10 text-primary border-0",
      removed: "bg-destructive/10 text-destructive border-0",
    };
    return <Badge className={`text-xs capitalize ${map[status]}`}>{status.replace("_", " ")}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Fraud & Moderation</h1>
        <p className="text-sm text-muted-foreground">Monitor suspicious activity and maintain platform integrity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Flagged Orders" value={String(suspiciousOrders.length)} icon={ShieldAlert} change={`${suspiciousOrders.filter((o: any) => o.riskLevel === "high").length} high risk`} changeType="negative" />
        <StatCard title="Fake Reviews" value={String(fakeReviews.length)} icon={MessageSquareWarning} change={`Today: ${fakeReviews.length}`} changeType="negative" />
        <StatCard title="Abuse Reports" value={String(abuseReports.length)} icon={Flag} change={`${abuseReports.filter((r: any) => r.status === "pending").length} pending`} changeType="negative" />
        <StatCard title="Accounts Blocked" value="—" icon={UserX} change="This month" changeType="neutral" />
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Suspicious Orders</TabsTrigger>
          <TabsTrigger value="reviews">Fake Reviews</TabsTrigger>
          <TabsTrigger value="abuse">Abuse Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousOrders.map((o: any) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-sm">{o.id}</TableCell>
                      <TableCell className="font-medium">{o.customer}</TableCell>
                      <TableCell>₹{(o.amount || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell>{riskBadge(o.riskLevel)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-48 truncate">{o.reason}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("Reviewing", o.id)}><Eye className="h-3.5 w-3.5 mr-2" /> Investigate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Approved", o.id)}><Check className="h-3.5 w-3.5 mr-2" /> Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Blocked", o.id)} className="text-destructive"><Ban className="h-3.5 w-3.5 mr-2" /> Block & Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fakeReviews.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="font-medium text-sm">{r.product}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.reviewer}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-0.5 text-xs">
                          <Star className={`h-3 w-3 ${r.rating >= 4 ? "fill-warning text-warning" : "fill-destructive text-destructive"}`} />
                          {r.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-32 truncate">{r.text}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-32 truncate">{r.reason}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAction("Approved review", r.id)}><Check className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleAction("Removed review", r.id)}><Ban className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abuse" className="mt-4">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abuseReports.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.type}</Badge></TableCell>
                      <TableCell className="font-medium text-sm">{r.target}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                      <TableCell className="text-center font-medium">{r.reports}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("Investigating", r.id)}>Investigate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Warned", r.id)}>Warn User</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleAction("Banned", r.id)}>Ban & Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
