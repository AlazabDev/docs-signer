import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploader } from '@/components/review/FileUploader';
import { ReviewActions } from '@/components/review/ReviewActions';
import { AIAssistantChat } from '@/components/review/AIAssistantChat';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Download,
  ExternalLink,
  MessageCircle,
  Eye,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Document {
  id: string;
  number: string;
  type: string;
  client_name: string;
  client_email: string | null;
  date: string;
  total: number;
  currency: string;
  status: string;
  payment_status: string;
  file_url: string | null;
  pdf_url: string | null;
  html_url: string | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<string, string> = {
  draft: 'مسودة',
  in_review: 'قيد المراجعة',
  needs_fix: 'يحتاج تعديل',
  ready_to_approve: 'جاهز للاعتماد',
  approved: 'معتمد',
  signed: 'موقع',
  archived: 'مؤرشف',
};

const statusClasses: Record<string, string> = {
  draft: 'status-draft',
  in_review: 'status-review',
  needs_fix: 'status-needsfix',
  ready_to_approve: 'status-ready',
  approved: 'status-approved',
  signed: 'status-signed',
  archived: 'status-archived',
};

export default function InvoiceView() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const hash = searchParams.get('hash');

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDocument(data);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, hash]);

  const handleUploadComplete = (fileUrl: string) => {
    if (document) {
      setDocument({ ...document, file_url: fileUrl });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (document) {
      setDocument({ ...document, status: newStatus });
    }
  };

  if (loading) {
    return (
      <MainLayout title="تحميل..." subtitle="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!document) {
    return (
      <MainLayout title="غير موجود" subtitle="">
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">المستند غير موجود</h2>
            <p className="text-muted-foreground">
              لم يتم العثور على المستند المطلوب أو انتهت صلاحية الرابط
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={`${document.type === 'invoice' ? 'فاتورة' : 'عرض سعر'} #${document.number}`}
      subtitle={document.client_name}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Preview */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                معاينة المستند
              </CardTitle>
              <div className="flex items-center gap-2">
                {document.pdf_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={document.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 ml-2" />
                      تحميل PDF
                    </a>
                  </Button>
                )}
                {document.html_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={document.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      عرض في دفترة
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {document.file_url || document.pdf_url ? (
                <div className="bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src={document.file_url || document.pdf_url || ''}
                    className="w-full h-[600px]"
                    title="Document Preview"
                  />
                </div>
              ) : (
                <FileUploader
                  documentId={document.id}
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </CardContent>
          </Card>

          {/* AI Summary */}
          {document.ai_summary && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  ملخص AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {document.ai_summary}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                تفاصيل المستند
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الحالة</span>
                <Badge className={statusClasses[document.status]}>
                  {statusLabels[document.status] || document.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">النوع</span>
                <span className="font-medium">
                  {document.type === 'invoice' ? 'فاتورة' : 'عرض سعر'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الرقم</span>
                <span className="font-medium">{document.number}</span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{document.client_name}</p>
                  {document.client_email && (
                    <p className="text-sm text-muted-foreground">{document.client_email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {format(new Date(document.date), 'dd MMMM yyyy', { locale: ar })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-bold">
                  {document.total.toLocaleString()} {document.currency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Review Actions */}
          <ReviewActions
            documentId={document.id}
            currentStatus={document.status}
            onStatusChange={handleStatusChange}
          />

          {/* Activity Timeline */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                سجل النشاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">تم إنشاء المستند</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(document.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                    </p>
                  </div>
                </div>
                {document.updated_at !== document.created_at && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-accent" />
                    <div>
                      <p className="font-medium">آخر تحديث</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(document.updated_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Chat Button */}
      <Button
        size="lg"
        className="fixed bottom-6 left-6 rounded-full w-14 h-14 shadow-lg"
        onClick={() => setShowChat(!showChat)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* AI Chat Dialog */}
      {showChat && (
        <div className="fixed bottom-24 left-6 w-96 z-50">
          <AIAssistantChat
            documentId={document.id}
            documentContext={`
              نوع المستند: ${document.type === 'invoice' ? 'فاتورة' : 'عرض سعر'}
              الرقم: ${document.number}
              العميل: ${document.client_name}
              المبلغ: ${document.total} ${document.currency}
              التاريخ: ${document.date}
              الحالة: ${statusLabels[document.status]}
            `}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
    </MainLayout>
  );
}
