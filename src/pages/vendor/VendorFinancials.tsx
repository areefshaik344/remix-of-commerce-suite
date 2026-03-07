import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Wallet, ArrowDownToLine } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Sep", revenue: 820000, payout: 738000 },
  { month: "Oct", revenue: 1150000, payout: 1035000 },
  { month: "Nov", revenue: 1890000, payout: 1701000 },
  { month: "Dec", revenue: 2340000, payout: 2106000 },
  { month: "Jan", revenue: 1560000, payout: 1404000 },
  { month: "Feb", revenue: 1230000, payout: 1107000 },
];

const payouts = [
  { id: "PAY-001", date: "2025-02-28", amount: 1107000, status: "completed" },
  { id: "PAY-002", date: "2025-01-31", amount: 1404000, status: "completed" },
  { id: "PAY-003", date: "2024-12-31", amount: 2106000, status: "completed" },
  { id: "PAY-004", date: "2024-11-30", amount: 1701000, status: "completed" },
  { id: "PAY-005", date: "2025-03-15", amount: 980000, status: "pending" },
];

const fmt = (p: number) => `₹${(p / 100000).toFixed(1)}L`;

export default function VendorFinancials() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold">Financial Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹89.5L" icon={DollarSign} change="+12%" changeType="positive" />
        <StatCard title="This Month" value="₹12.3L" icon={TrendingUp} change="-5%" changeType="negative" />
        <StatCard title="Pending Payout" value="₹9.8L" icon={Wallet} change="Processing" changeType="neutral" />
        <StatCard title="Commission Rate" value="10%" icon={ArrowDownToLine} />
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Revenue vs Payouts</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} className="text-xs" />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="revenue" className="fill-primary/20 stroke-primary" strokeWidth={2} />
              <Area type="monotone" dataKey="payout" className="fill-success/20 stroke-success" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Payout History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.id}</TableCell>
                  <TableCell className="text-sm">{new Date(p.date).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell className="font-medium">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "completed" ? "default" : "secondary"} className={p.status === "completed" ? "bg-success/10 text-success border-0" : ""}>
                      {p.status}
                    </Badge>
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
