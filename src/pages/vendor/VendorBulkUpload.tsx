import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, FileSpreadsheet, Check, AlertTriangle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UploadResult {
  total: number;
  success: number;
  errors: { row: number; field: string; message: string }[];
}

export default function VendorBulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (!f.name.endsWith(".csv") && !f.name.endsWith(".xlsx")) {
        toast({ title: "Invalid file", description: "Please upload a CSV or Excel file.", variant: "destructive" });
        return;
      }
      setFile(f);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(i);
    }

    // Mock result
    setResult({
      total: 25,
      success: 22,
      errors: [
        { row: 8, field: "price", message: "Price must be a positive number" },
        { row: 15, field: "category", message: "Unknown category 'Gadgets'" },
        { row: 21, field: "sku", message: "Duplicate SKU 'WH-100'" },
      ],
    });
    setUploading(false);
    toast({ title: "Upload complete", description: "22 of 25 products imported successfully." });
  };

  const downloadTemplate = () => {
    const csv = "name,description,category,subcategory,brand,price,originalPrice,sku,stockCount,image1,image2\nSample Product,A great product,electronics,Smartphones,BrandName,9999,12999,SKU-001,50,https://example.com/img1.jpg,";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markethub-product-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-xl font-bold">Bulk Product Upload</h1>
        <p className="text-sm text-muted-foreground">Import multiple products at once using a CSV or Excel file</p>
      </div>

      {/* Template Download */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1. Download Template</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Start with our template to ensure your data is formatted correctly.</p>
          <Button variant="outline" className="gap-2" onClick={downloadTemplate}>
            <Download className="h-4 w-4" /> Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2. Upload Your File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-3" />
            {file ? (
              <div className="text-center">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground">CSV or Excel files (max 5MB)</p>
              </div>
            )}
          </label>

          {file && !uploading && !result && (
            <Button className="w-full gap-2" onClick={handleUpload}>
              <Upload className="h-4 w-4" /> Upload & Import Products
            </Button>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">3. Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>{result.success} imported</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-destructive" />
                <span>{result.errors.length} failed</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {result.total} rows
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-warning" /> Errors
                </h4>
                <div className="rounded-lg border divide-y text-sm">
                  {result.errors.map((err, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px] shrink-0">Row {err.row}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">{err.field}</span>
                      <span className="text-muted-foreground">{err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" onClick={() => { setFile(null); setResult(null); }}>
              Upload Another File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
