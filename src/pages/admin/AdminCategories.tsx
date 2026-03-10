import { useState } from "react";
import { categories } from "@/data/mock-products";
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

export default function AdminCategories() {
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ name: string; icon: string; slug: string; subcategories: string[] } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newSubcategory, setNewSubcategory] = useState("");

  const openAdd = () => {
    setEditCategory({ name: "", icon: "📦", slug: "", subcategories: [] });
    setEditOpen(true);
  };

  const openEdit = (cat: typeof categories[0]) => {
    setEditCategory({ name: cat.name, icon: cat.icon, slug: cat.slug, subcategories: [...cat.subcategories] });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!editCategory?.name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    toast({ title: editCategory.slug ? "Category updated" : "Category created", description: `"${editCategory.name}" saved.` });
    setEditOpen(false);
  };

  const addSubcategory = () => {
    if (!newSubcategory.trim() || !editCategory) return;
    setEditCategory({ ...editCategory, subcategories: [...editCategory.subcategories, newSubcategory.trim()] });
    setNewSubcategory("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Category Management</h1>
        <Button size="sm" className="gap-1" onClick={openAdd}><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.slice(0, 3).map(s => (
                        <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                      ))}
                      {cat.subcategories.length > 3 && <Badge variant="outline" className="text-[10px]">+{cat.subcategories.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{cat.productCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(cat.name)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCategory?.slug ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input value={editCategory?.icon || ""} onChange={e => editCategory && setEditCategory({ ...editCategory, icon: e.target.value })} className="text-center text-lg" />
              </div>
              <div className="col-span-3 space-y-2">
                <Label>Category Name</Label>
                <Input value={editCategory?.name || ""} onChange={e => editCategory && setEditCategory({ ...editCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="e.g. Electronics" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subcategories</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editCategory?.subcategories.map((s, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {s}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => editCategory && setEditCategory({ ...editCategory, subcategories: editCategory.subcategories.filter((_, j) => j !== i) })} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newSubcategory} onChange={e => setNewSubcategory(e.target.value)} placeholder="Add subcategory..." onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSubcategory())} />
                <Button variant="outline" size="sm" onClick={addSubcategory}>Add</Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget}"? All products in this category will need to be re-categorized.`}
        confirmLabel="Delete"
        onConfirm={() => { toast({ title: "Category deleted", description: `"${deleteTarget}" removed.` }); setDeleteTarget(null); }}
      />
    </div>
  );
}
