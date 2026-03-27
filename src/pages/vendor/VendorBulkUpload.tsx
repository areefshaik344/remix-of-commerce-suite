import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, Download, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { vendorApi } from "@/api/vendorApi";
import { getErrorMessage } from "@/api/errorMapper";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.match(/\.(csv|xlsx|xls)$/)) {
        toast({ title: "Invalid file", description: "Please upload a CSV or Excel file.", variant: "destructive" });
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress (real upload doesn't provide progress from httpClient)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const res = await vendorApi.bulkUploadProducts(formData);
      clearInterval(progressInterval);
      setProgress(100);

      setResult({
        total: res.total || 0,
        success: res.success || 0,
        errors: res.errors || [],
      });
      toast({ title: "Upload complete", description: `${res.success || 0} of ${res.total || 0} products imported successfully.` });
    } catch (e) {
      toast({ title: "Upload failed", description: getErrorMessage(e), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "name,sku,category,brand,price,comparePrice,stock,description,image1,image2\n";
    const sample = 'Sample Product,SKU-001,Electronics,BrandX,999,1299,50,"Description here",https://img.url/1.jpg,https://img.url/2.jpg\n';
    const blob = new Blob([headers + sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-upload-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-xl font-bold">Bulk Product Upload</h1>
        <p className="text-sm text-muted-foreground">Import multiple products at once using CSV or Excel</p>
      </div>

      {/* Step 1: Template */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4" /> Step 1: Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Download the CSV template, fill in your product data, then upload.</p>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Download Template
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Upload */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" /> Step 2: Upload File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">{file ? file.name : "Click to select CSV or Excel file"}</p>
            <p className="text-xs text-muted-foreground mt-1">Supports .csv, .xlsx, .xls</p>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{progress}% uploaded</p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload & Import"}
          </Button>
        </CardContent>
      </Card>

      {/* Step 3: Results */}
      {result && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-muted p-3"><p className="text-2xl font-bold">{result.total}</p><p className="text-xs text-muted-foreground">Total Rows</p></div>
              <div className="rounded-lg bg-primary/5 p-3"><p className="text-2xl font-bold text-primary">{result.success}</p><p className="text-xs text-muted-foreground">Imported</p></div>
              <div className="rounded-lg bg-destructive/5 p-3"><p className="text-2xl font-bold text-destructive">{result.errors.length}</p><p className="text-xs text-muted-foreground">Errors</p></div>
            </div>

            {result.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-warning" /> Errors</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.errors.map((err, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-sm">{err.row}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{err.field}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{err.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Button variant="outline" onClick={() => { setFile(null); setResult(null); setProgress(0); }}>Upload Another File</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
