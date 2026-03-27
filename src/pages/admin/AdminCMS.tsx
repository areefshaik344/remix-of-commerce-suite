import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image, Plus, Pencil, Trash2, Eye, GripVertical } from "lucide-react";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/api/errorMapper";

export default function AdminCMS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("banners");

  const { data: banners, isLoading: bannersLoading, error: bannersError, refetch: refetchBanners } = useApiQuery(
    () => adminApi.getBanners(), []
  );
  const { data: sections, isLoading: sectionsLoading, error: sectionsError } = useApiQuery(
    () => adminApi.getSections(), []
  );
  const { data: pages, isLoading: pagesLoading, error: pagesError } = useApiQuery(
    () => adminApi.getPages(), []
  );

  const handleDeleteBanner = async (id: string) => {
    try {
      await adminApi.deleteBanner(id);
      toast({ title: "Banner deleted" });
      refetchBanners();
    } catch (e) {
      toast({ title: "Failed to delete", description: getErrorMessage(e), variant: "destructive" });
    }
  };

  const isLoading = bannersLoading || sectionsLoading || pagesLoading;
  const error = bannersError || sectionsError || pagesError;
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load CMS data" />;

  const bannerList = Array.isArray(banners) ? banners : [];
  const sectionList = Array.isArray(sections) ? sections : [];
  const pageList = Array.isArray(pages) ? pages : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Content Management</h1>
          <p className="text-sm text-muted-foreground">Manage banners, homepage sections, and static pages</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="sections">Homepage Sections</TabsTrigger>
          <TabsTrigger value="pages">Static Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => navigate("/admin/cms/banners/new")}><Plus className="h-4 w-4 mr-1" /> Add Banner</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Banner</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannerList.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 rounded bg-muted flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-sm">{b.title}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{b.position}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={b.active ? "default" : "secondary"}>{b.active ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/cms/banners/${b.id}/edit`)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/cms/banners/${b.id}/edit`)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Homepage Layout</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sectionList.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`section-${s.id}`} className="text-xs">Visible</Label>
                    <Switch id={`section-${s.id}`} defaultChecked={s.visible} />
                  </div>
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Page</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageList.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.slug}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{p.updated || p.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
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
