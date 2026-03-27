import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/api/adminApi";
import { useApiQuery } from "@/hooks/useApiQuery";
import { PageError } from "@/components/shared/PageError";
import { DashboardSkeleton } from "@/components/shared/ProductSkeleton";
import { getErrorMessage } from "@/api/errorMapper";

export default function AdminCategories() {
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ id?: string; name: string; icon: string; slug: string; subcategories: string[] } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: categoriesResp, isLoading, error, refetch } = useApiQuery(
    () => adminApi.getCategories(), []
  );

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <PageError message="Failed to load categories" />;

  const categories = Array.isArray(categoriesResp) ? categoriesResp : [];

  const openAdd = () => {
    setEditCategory({ name: "", icon: "📦", slug: "", subcategories: [] });
    setEditOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditCategory({ id: cat.id, name: cat.name, icon: cat.icon, slug: cat.slug, subcategories: [...(cat.subcategories || [])] });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editCategory?.name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editCategory.id) {
        await adminApi.updateCategory(editCategory.id, editCategory);
      } else {
        await adminApi.createCategory(editCategory);
      }
      toast({ title: editCategory.id ? "Category updated" : "Category created", description: `"${editCategory.name}" saved.` });
      setEditOpen(false);
      refetch();
    } catch (e) {
      toast({ title: "Failed to save", description: getErrorMessage(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteCategory(deleteTarget);
      toast({ title: "Category deleted" });
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      toast({ title: "Failed to delete", description: getErrorMessage(e), variant: "destructive" });
    }
  };

  const addSubcategory = () => {
    if (!newSubcategory.trim() || !editCategory) return;
    setEditCategory({ ...editCategory, subcategories: [...editCategory.subcategories, newSubcategory.trim()] });
    setNewSubcategory("");
  };

  const removeSubcategory = (idx: number) => {
    if (!editCategory) return;
    setEditCategory({ ...editCategory, subcategories: editCategory.subcategories.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat: any) => (
                <TableRow key={cat.id || cat.slug}>
                  <TableCell className="text-xl">{cat.icon}</TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{cat.slug}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(cat.subcategories || []).slice(0, 3).map((sc: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{sc}</Badge>
                      ))}
                      {(cat.subcategories || []).length > 3 && <Badge variant="outline" className="text-[10px]">+{cat.subcategories.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editCategory?.id ? "Edit" : "Add"} Category</DialogTitle></DialogHeader>
          {editCategory && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-2"><Label>Icon</Label><Input value={editCategory.icon} onChange={e => setEditCategory({ ...editCategory, icon: e.target.value })} className="text-center text-xl" /></div>
                <div className="space-y-2 col-span-3"><Label>Name *</Label><Input value={editCategory.name} onChange={e => setEditCategory({ ...editCategory, name: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Slug</Label><Input value={editCategory.slug} onChange={e => setEditCategory({ ...editCategory, slug: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Subcategories</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {editCategory.subcategories.map((sc, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1">{sc}<button onClick={() => removeSubcategory(i)}><X className="h-3 w-3" /></button></Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newSubcategory} onChange={e => setNewSubcategory(e.target.value)} placeholder="Add subcategory" onKeyDown={e => e.key === "Enter" && addSubcategory()} />
                  <Button variant="outline" size="sm" onClick={addSubcategory}>Add</Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Category?" description="This will remove the category and reassign its products." onConfirm={handleDelete} />
    </div>
  );
}
