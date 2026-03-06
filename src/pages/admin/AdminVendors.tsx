import { vendors } from "@/data/mock-users";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Star, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminVendors() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">Vendor Management</h1>
        <p className="text-sm text-muted-foreground">{vendors.length} vendors registered</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Store</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Rating</th>
                  <th className="text-right p-3 font-medium">Products</th>
                  <th className="text-right p-3 font-medium">Orders</th>
                  <th className="text-right p-3 font-medium">Revenue</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{v.logo}</span>
                        <div>
                          <p className="font-medium">{v.storeName}</p>
                          <p className="text-xs text-muted-foreground">{v.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{v.category}</td>
                    <td className="p-3 text-center">
                      <Badge variant={v.status === "active" ? "default" : v.status === "pending" ? "secondary" : "destructive"} className="text-xs capitalize">{v.status}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-warning text-warning" />{v.rating}</span>
                    </td>
                    <td className="p-3 text-right">{v.totalProducts}</td>
                    <td className="p-3 text-right">{v.totalOrders.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium">₹{(v.totalRevenue / 100000).toFixed(1)}L</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        {v.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-success"><Check className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Products</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
