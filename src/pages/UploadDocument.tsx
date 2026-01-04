import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Plus, Trash2, Send, ArrowRight, FileText, Loader2, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Reviewer {
  id: string;
  name: string;
  email: string;
  department: 'engineering' | 'procurement' | 'accounting';
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const departmentLabels: Record<string, string> = {
  engineering: 'الهندسة',
  procurement: 'المشتريات',
  accounting: 'الحسابات',
};

export default function UploadDocument() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [senderName, setSenderName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [reviewers, setReviewers] = useState<Reviewer[]>([
    { id: '1', name: '', email: '', department: 'engineering' },
    { id: '2', name: '', email: '', department: 'procurement' },
    { id: '3', name: '', email: '', department: 'accounting' },
  ]);

  const handleFiles = useCallback((selectedFiles: FileList | File[]) => {
    const validFiles: UploadedFile[] = [];
    Array.from(selectedFiles).forEach((file) => {
      if (file.type === 'application/pdf') {
        validFiles.push({ file, progress: 0, status: 'pending' });
      }
    });
    
    if (validFiles.length === 0) {
      toast({ title: 'خطأ', description: 'يرجى اختيار ملفات PDF فقط', variant: 'destructive' });
      return;
    }
    
    setFiles((prev) => [...prev, ...validFiles]);
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addReviewer = () => {
    setReviewers([
      ...reviewers,
      { id: crypto.randomUUID(), name: '', email: '', department: 'engineering' },
    ]);
  };

  const removeReviewer = (id: string) => {
    if (reviewers.length > 1) {
      setReviewers(reviewers.filter((r) => r.id !== id));
    }
  };

  const updateReviewer = (id: string, field: keyof Reviewer, value: string) => {
    setReviewers(
      reviewers.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({ title: 'خطأ', description: 'يرجى اختيار ملف PDF واحد على الأقل', variant: 'destructive' });
      return;
    }

    if (!title.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال عنوان المستند', variant: 'destructive' });
      return;
    }

    const validReviewers = reviewers.filter((r) => r.name.trim() && r.email.trim());
    if (validReviewers.length === 0) {
      toast({ title: 'خطأ', description: 'يرجى إضافة مراجع واحد على الأقل', variant: 'destructive' });
      return;
    }

    setUploading(true);
    let successCount = 0;
    let lastDocumentId = '';

    try {
      for (let i = 0; i < files.length; i++) {
        const uploadFile = files[i];
        
        // Update status to uploading
        setFiles((prev) => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading' as const, progress: 10 } : f
        ));

        try {
          // 1. Upload file to storage
          const fileName = `${Date.now()}-${uploadFile.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, uploadFile.file);

          if (uploadError) throw uploadError;

          setFiles((prev) => prev.map((f, idx) => 
            idx === i ? { ...f, progress: 50 } : f
          ));

          // 2. Get public URL
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // 3. Create document record
          const docTitle = files.length > 1 ? `${title} (${i + 1}/${files.length})` : title;
          const { data: documentData, error: docError } = await supabase
            .from('documents')
            .insert({
              number: `DOC-${Date.now()}-${i}`,
              type: 'estimate',
              client_name: senderName || 'غير محدد',
              title: docTitle,
              description,
              sender_name: senderName,
              project_id: projectId || null,
              file_url: urlData.publicUrl,
              status: 'in_review',
              total: 0,
              currency: 'SAR',
            })
            .select()
            .single();

          if (docError) throw docError;

          setFiles((prev) => prev.map((f, idx) => 
            idx === i ? { ...f, progress: 80 } : f
          ));

          lastDocumentId = documentData.id;

          // 4. Create reviewer records
          const reviewerRecords = validReviewers.map((r) => ({
            document_id: documentData.id,
            reviewer_name: r.name,
            reviewer_email: r.email,
            department: r.department,
          }));

          const { error: reviewerError } = await supabase
            .from('document_reviewers')
            .insert(reviewerRecords);

          if (reviewerError) throw reviewerError;

          setFiles((prev) => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'success' as const, progress: 100 } : f
          ));
          
          successCount++;
        } catch (fileError) {
          console.error(`Error uploading file ${i}:`, fileError);
          setFiles((prev) => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'error' as const, error: 'فشل الرفع' } : f
          ));
        }
      }

      if (successCount > 0) {
        toast({
          title: 'تم الرفع بنجاح',
          description: `تم رفع ${successCount} من ${files.length} ملفات وإرسالها للمراجعين`,
        });

        if (files.length === 1 && lastDocumentId) {
          navigate(`/documents/${lastDocumentId}`);
        } else {
          navigate('/documents');
        }
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل رفع جميع الملفات',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء رفع المستندات',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout title="رفع مستند جديد" subtitle="قم برفع ملف PDF وتحديد المراجعين للتوقيع">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/documents')}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              رفع مستند جديد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>ملفات PDF (يمكن رفع عدة ملفات)</Label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-primary/50 ${
                  dragActive ? 'border-primary bg-primary/5' : files.length > 0 ? 'border-primary/50' : 'border-border'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">اسحب الملفات هنا أو اضغط للاختيار</p>
                <p className="text-xs text-muted-foreground mt-2">PDF فقط - يمكن رفع عدة ملفات</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              
              {/* Files List */}
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  {files.map((f, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className={`w-5 h-5 ${
                        f.status === 'success' ? 'text-green-500' : 
                        f.status === 'error' ? 'text-destructive' : 
                        'text-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.file.name}</p>
                        {f.status === 'uploading' && (
                          <Progress value={f.progress} className="h-1 mt-1" />
                        )}
                        {f.status === 'error' && (
                          <p className="text-xs text-destructive">{f.error}</p>
                        )}
                      </div>
                      {f.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      {f.status === 'success' && (
                        <span className="text-xs text-green-500">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <Label>المشروع</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project1">مشروع الرياض - فرع 1</SelectItem>
                  <SelectItem value="project2">مشروع جدة - فرع 2</SelectItem>
                  <SelectItem value="project3">مشروع الدمام - فرع 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>عنوان المستند *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: مستخلص أعمال فرع المهندسين"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر للمستند..."
                rows={3}
              />
            </div>

            {/* Sender Name */}
            <div className="space-y-2">
              <Label>اسم المرسل</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="اسمك"
              />
            </div>

            {/* Reviewers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">المراجعون</Label>
                <Button variant="outline" size="sm" onClick={addReviewer}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مراجع
                </Button>
              </div>

              {reviewers.map((reviewer, index) => (
                <Card key={reviewer.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">مراجع {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeReviewer(reviewer.id)}
                        disabled={reviewers.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>الإدارة</Label>
                        <Select
                          value={reviewer.department}
                          onValueChange={(v) =>
                            updateReviewer(reviewer.id, 'department', v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineering">الهندسة</SelectItem>
                            <SelectItem value="procurement">المشتريات</SelectItem>
                            <SelectItem value="accounting">الحسابات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>اسم المراجع *</Label>
                        <Input
                          value={reviewer.name}
                          onChange={(e) =>
                            updateReviewer(reviewer.id, 'name', e.target.value)
                          }
                          placeholder="الاسم"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          value={reviewer.email}
                          onChange={(e) =>
                            updateReviewer(reviewer.id, 'email', e.target.value)
                          }
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  رفع وإرسال للمراجعة
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
