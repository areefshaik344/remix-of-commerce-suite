import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RotateCcw, Check, X, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReturnRequest {
  id: string;
  orderId: string;
  productName: string;
  customerName: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "refunded";
  requestDate: string;
  amount: number;
}

const mockReturns: ReturnRequest[] = [
  { id: "ret-1", orderId: "ORD-10001", productName: "iPhone 15 Pro Max", customerName: "Rahul Sharma", reason: "Defective screen", status: "pending", requestDate: "2025-03-08", amount: 134900 },
  { id: "ret-2", orderId: "ORD-10004", productName: "The Alchemist", customerName: "Vikram Joshi", reason: "Wrong edition received", status: "approved", requestDate: "2025-03-05", amount: 299 },
  { id: "ret-3", orderId: "ORD-10002", productName: "Nike Air Max 270 React", customerName: "Rahul Sharma", reason: "Size doesn't fit", status: "refunded", requestDate: "2025-02-28", amount: 12995 },
  { id: "ret-4", orderId: "ORD-10007", productName: "Samsung Galaxy S24 Ultra", customerName: "Vikram Joshi", reason: "Changed my mind", status: "rejected", requestDate: "2025-02-20", amount: 129999 },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  refunded: "bg-success/10 text-success",
};

export default function VendorReturns() {
  const [returns, setReturns] = useState(mockReturns);
  const [statusFilter, setStatusFilter] = useState("all");
  const [respondingTo, setRespondingTo] = useState<ReturnRequest | null>(null);
  const [response, setResponse] = useState("");

  const filtered = statusFilter === "all" ? returns : returns.filter(r => r.status === statusFilter);
  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    toast({ title: action === "approved" ? "Return approved" : "Return rejected" });
  };

  const handleRefund = (id: string) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status: "refunded" } : r));
    toast({ title: "Refund processed" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Returns & Refunds</h1>
          <p className="text-sm text-muted-foreground">{returns.filter(r => r.status === "pending").length} pending review</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No return requests</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Return ID</th>
                    <th className="text-left p-3 font-medium">Order</th>
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Reason</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                    <th className="text-center p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ret => (
                    <tr key={ret.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{ret.id}</td>
                      <td className="p-3 font-mono text-xs">{ret.orderId}</td>
                      <td className="p-3 font-medium max-w-[150px] truncate">{ret.productName}</td>
                      <td className="p-3 text-muted-foreground">{ret.customerName}</td>
                      <td className="p-3 text-muted-foreground max-w-[150px] truncate">{ret.reason}</td>
                      <td className="p-3 text-right font-medium">{formatPrice(ret.amount)}</td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary" className={`text-xs capitalize border-0 ${statusColors[ret.status]}`}>{ret.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          {ret.status === "pending" && (
                            <>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-success" onClick={() => handleAction(ret.id, "approved")}><Check className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleAction(ret.id, "rejected")}><X className="h-3.5 w-3.5" /></Button>
                            </>
                          )}
                          {ret.status === "approved" && (
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleRefund(ret.id)}>Process Refund</Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setRespondingTo(ret); setResponse(""); }}>
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!respondingTo} onOpenChange={() => setRespondingTo(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Respond to {respondingTo?.customerName}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Product:</strong> {respondingTo?.productName}</p>
              <p><strong>Reason:</strong> {respondingTo?.reason}</p>
            </div>
            <div className="space-y-2">
              <Label>Your Response</Label>
              <Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Type your response to the customer..." rows={4} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRespondingTo(null)}>Cancel</Button>
              <Button onClick={() => { toast({ title: "Response sent" }); setRespondingTo(null); }}>Send Response</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
