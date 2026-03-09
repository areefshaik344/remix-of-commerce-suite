import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image, Plus, Pencil, Trash2, Eye, GripVertical } from "lucide-react";

const banners = [
  { id: "1", title: "Summer Sale - Up to 70% Off", image: "/placeholder.svg", position: "hero", active: true, order: 1 },
  { id: "2", title: "New Arrivals Collection", image: "/placeholder.svg", position: "hero", active: true, order: 2 },
  { id: "3", title: "Free Shipping on Orders $50+", image: "/placeholder.svg", position: "top-bar", active: true, order: 1 },
  { id: "4", title: "Festival Special Deals", image: "/placeholder.svg", position: "hero", active: false, order: 3 },
];

const sections = [
  { id: "1", name: "Featured Products", type: "product-grid", visible: true, order: 1 },
  { id: "2", name: "Deals of the Day", type: "countdown-grid", visible: true, order: 2 },
  { id: "3", name: "Categories", type: "category-carousel", visible: true, order: 3 },
  { id: "4", name: "Trending Now", type: "product-carousel", visible: true, order: 4 },
  { id: "5", name: "Brand Spotlight", type: "banner", visible: false, order: 5 },
];

const pages = [
  { id: "1", title: "About Us", slug: "/about", status: "published", updated: "2025-01-10" },
  { id: "2", title: "Privacy Policy", slug: "/privacy", status: "published", updated: "2025-01-05" },
  { id: "3", title: "Terms of Service", slug: "/terms", status: "published", updated: "2025-01-05" },
  { id: "4", title: "Contact Us", slug: "/contact", status: "draft", updated: "2025-01-12" },
  { id: "5", title: "FAQ", slug: "/faq", status: "published", updated: "2025-01-08" },
];

export default function AdminCMS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("banners");

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
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Banner</Button>
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
                  {banners.map(b => (
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
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
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

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Homepage Layout</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {sections.map(s => (
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
                  {pages.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.slug}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{p.updated}</TableCell>
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
