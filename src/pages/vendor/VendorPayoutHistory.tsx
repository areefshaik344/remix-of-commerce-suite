import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Clock, CheckCircle, Download, ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { vendorApi } from "@/api/vendorApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";

const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

export default function VendorPayoutHistory() {
  const navigate = useNavigate();

  const { data: payoutsResp, isLoading, error } = useApiQuery(
    () => vendorApi.getPayoutHistory(), []
  );

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load payout history" />;

  const payouts: any[] = Array.isArray(payoutsResp) ? payoutsResp : [];
  const totalPaid = payouts.filter(p => p.status === "completed").reduce((s, p) => s + (p.netAmount || 0), 0);
  const pending = payouts.filter(p => p.status !== "completed").reduce((s, p) => s + (p.netAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/financials")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="font-display text-xl font-bold">Payout History</h1>
          <p className="text-sm text-muted-foreground">Detailed settlement and payout records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Paid Out" value={fmt(totalPaid)} icon={CheckCircle} change="All time" changeType="neutral" />
        <StatCard title="Pending Payout" value={fmt(pending)} icon={Clock} change="Processing" changeType="neutral" />
        <StatCard title="Avg Commission" value="10%" icon={TrendingUp} change="Per sale" changeType="neutral" />
        <StatCard title="Next Payout" value="—" icon={Wallet} change={fmt(pending)} changeType="neutral" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">All Payouts</CardTitle>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Gross Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Net Payout</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.id}</TableCell>
                  <TableCell className="text-sm">{p.period}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell className="text-sm">₹{(p.amount || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm text-destructive">-₹{(p.commission || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="font-medium text-sm">₹{(p.netAmount || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm">{p.orders}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "completed" ? "default" : "secondary"} className={p.status === "completed" ? "bg-success/10 text-success border-0" : p.status === "processing" ? "bg-warning/10 text-warning border-0" : ""}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Payout {p.id}</DialogTitle></DialogHeader>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span>{p.period}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{new Date(p.date).toLocaleDateString("en-IN")}</span></div>
                          <Separator />
                          <div className="flex justify-between"><span className="text-muted-foreground">Gross Revenue</span><span>₹{(p.amount || 0).toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Commission</span><span className="text-destructive">-₹{(p.commission || 0).toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between font-medium"><span>Net Payout</span><span>₹{(p.netAmount || 0).toLocaleString("en-IN")}</span></div>
                          <Separator />
                          <div className="flex justify-between"><span className="text-muted-foreground">Orders Settled</span><span>{p.orders}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Transaction Ref</span><span className="font-mono text-xs">{p.txnRef || "—"}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={p.status === "completed" ? "default" : "secondary"}>{p.status}</Badge></div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
