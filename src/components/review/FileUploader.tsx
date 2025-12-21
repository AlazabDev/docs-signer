import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  documentId: string;
  onUploadComplete: (fileUrl: string) => void;
}

export function FileUploader({ documentId, onUploadComplete }: FileUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('spreadsheet') && !file.type.includes('excel')) {
      toast({ title: "خطأ", description: "يرجى رفع ملف PDF أو Excel فقط", variant: "destructive" });
      return;
    }

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 20, 90));
    }, 300);

    try {
      // Simulated upload - replace with actual Supabase storage upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(interval);
      setProgress(100);
      
      const fakeUrl = `https://storage.example.com/${documentId}/${file.name}`;
      onUploadComplete(fakeUrl);
      
      toast({ title: "تم الرفع", description: "تم رفع الملف بنجاح" });
    } catch {
      toast({ title: "خطأ", description: "فشل في رفع الملف", variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [documentId, onUploadComplete, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-border'
      }`}
    >
      {uploading ? (
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
          <Progress value={progress} className="max-w-xs mx-auto" />
          <p className="text-muted-foreground">جاري الرفع...</p>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-bold mb-2">اسحب الملف هنا أو</h3>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <FileText className="w-4 h-4 ml-2" />
              اختر ملف
              <input
                type="file"
                accept=".pdf,.xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">PDF أو Excel (حتى 10MB)</p>
        </>
      )}
    </div>
  );
}
