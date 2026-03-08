import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, ShieldAlert, MessageSquareWarning, Eye, Ban, Check, MoreHorizontal, Star, Flag, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const suspiciousOrders = [
  { id: "ORD-8821", customer: "Unknown User", amount: 124500, reason: "Multiple high-value orders from new account", riskLevel: "high", date: "2025-03-07" },
  { id: "ORD-8819", customer: "Rajesh K", amount: 89000, reason: "Shipping address mismatch with billing", riskLevel: "medium", date: "2025-03-07" },
  { id: "ORD-8815", customer: "Test Account", amount: 45000, reason: "Repeated failed payment attempts", riskLevel: "high", date: "2025-03-06" },
  { id: "ORD-8810", customer: "Priya M", amount: 23400, reason: "Unusual buying pattern detected", riskLevel: "low", date: "2025-03-06" },
  { id: "ORD-8805", customer: "Anon User", amount: 67800, reason: "VPN/proxy detected", riskLevel: "medium", date: "2025-03-05" },
];

const fakeReviews = [
  { id: "REV-201", product: "iPhone 15 Pro Max", reviewer: "user_xyz123", rating: 1, text: "worst product ever buy this scam dont buy!!!!", reason: "Spam pattern, no verified purchase", date: "2025-03-07" },
  { id: "REV-198", product: "Sony WH-1000XM5", reviewer: "reviewer_bot_44", rating: 5, text: "Amazing product best quality!!!!! Buy now!!!!", reason: "Bot-like pattern, repetitive text", date: "2025-03-06" },
  { id: "REV-195", product: "Nike Air Max 90", reviewer: "fake_acc_99", rating: 5, text: "Perfect shoes perfect quality perfect everything", reason: "New account, bulk reviews posted", date: "2025-03-05" },
  { id: "REV-190", product: "MacBook Air M3", reviewer: "competitor_acct", rating: 1, text: "Don't buy this, buy XYZ brand instead", reason: "Competitor promotion suspected", date: "2025-03-04" },
];

const abuseReports = [
  { id: "RPT-55", type: "Vendor", target: "GlamourBox", reason: "Selling counterfeit products", reports: 12, status: "investigating" },
  { id: "RPT-52", type: "User", target: "spam_user_22", reason: "Harassing vendor in messages", reports: 5, status: "pending" },
  { id: "RPT-48", type: "Vendor", target: "ToyLand", reason: "Misleading product descriptions", reports: 8, status: "action_taken" },
  { id: "RPT-45", type: "Product", target: "Fake Designer Bag", reason: "Copyright infringement", reports: 15, status: "removed" },
];

export default function AdminFraud() {
  const { toast } = useToast();

  const handleAction = (action: string, id: string) => {
    toast({ title: `${action}`, description: `Action taken on ${id}` });
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
        <StatCard title="Flagged Orders" value={String(suspiciousOrders.length)} icon={ShieldAlert} change="2 high risk" changeType="negative" />
        <StatCard title="Fake Reviews" value={String(fakeReviews.length)} icon={MessageSquareWarning} change="Today: 2" changeType="negative" />
        <StatCard title="Abuse Reports" value={String(abuseReports.length)} icon={Flag} change="3 pending" changeType="negative" />
        <StatCard title="Accounts Blocked" value="23" icon={UserX} change="This month" changeType="neutral" />
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
                  {suspiciousOrders.map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-sm">{o.id}</TableCell>
                      <TableCell className="font-medium">{o.customer}</TableCell>
                      <TableCell>₹{o.amount.toLocaleString("en-IN")}</TableCell>
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
                  {fakeReviews.map(r => (
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
                  {abuseReports.map(r => (
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
                            <DropdownMenuItem>Investigate</DropdownMenuItem>
                            <DropdownMenuItem>Warn User</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Ban & Remove</DropdownMenuItem>
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
