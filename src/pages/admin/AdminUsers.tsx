import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SearchEmpty } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TablePagination, usePagination } from "@/components/shared/Pagination";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/ProductSkeleton";
import { PageError } from "@/components/shared/PageError";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);

  const { data: usersResp, isLoading, error, refetch } = useApiQuery(
    () => adminApi.getUsers(), []
  );

  const users = (usersResp?.data ?? usersResp ?? []) as any[];

  const filtered = users.filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filtered, 10);

  if (isLoading) return <div className="space-y-4"><h1 className="font-display text-xl font-bold">User Management</h1><TableSkeleton rows={6} cols={5} /></div>;
  if (error) return <div className="space-y-4"><h1 className="font-display text-xl font-bold">User Management</h1><PageError message={error} onRetry={refetch} /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">{users.length} registered users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {filtered.length === 0 && search ? (
            <SearchEmpty query={search} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">User</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-center p-3 font-medium">Role</th>
                      <th className="text-left p-3 font-medium">Phone</th>
                      <th className="text-left p-3 font-medium">Joined</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((user: any) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/admin/users/${user.id}`)}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{user.name[0]}</div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{user.email}</td>
                        <td className="p-3 text-center">
                          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs capitalize">{user.role}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{user.phone}</td>
                        <td className="p-3 text-muted-foreground">{new Date(user.joinedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>View Profile</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setSuspendTarget(user.name)}>Suspend</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={() => setSuspendTarget(null)}
        title="Suspend User"
        description={`Are you sure you want to suspend "${suspendTarget}"? They will not be able to access the platform.`}
        confirmLabel="Suspend"
        onConfirm={() => { toast({ title: "User suspended", description: `${suspendTarget} has been suspended.` }); setSuspendTarget(null); }}
      />
    </div>
  );
}
