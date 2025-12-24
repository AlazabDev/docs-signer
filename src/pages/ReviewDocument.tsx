import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PDFViewer } from '@/components/review/PDFViewer';
import { SignaturePanel } from '@/components/review/SignaturePanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  User, 
  Building2, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DocumentData {
  id: string;
  number: string;
  title: string | null;
  description: string | null;
  file_url: string | null;
  status: string;
  created_at: string;
}

interface ReviewerData {
  id: string;
  document_id: string;
  reviewer_name: string;
  reviewer_email: string;
  department: string;
  status: string;
  signed_at: string | null;
  signature_data: string | null;
  rejection_reason: string | null;
}

const departmentLabels: Record<string, string> = {
  engineering: 'الهندسة',
  procurement: 'المشتريات',
  accounting: 'الحسابات',
};

const statusLabels: Record<string, string> = {
  pending: 'في انتظار المراجعة',
  approved: 'تم الاعتماد',
  rejected: 'مرفوض',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  approved: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ReviewDocument() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const hash = searchParams.get('hash');
  const { toast } = useToast();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [reviewer, setReviewer] = useState<ReviewerData | null>(null);
  const [allReviewers, setAllReviewers] = useState<ReviewerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !hash) {
        setError('رابط غير صالح');
        setLoading(false);
        return;
      }

      try {
        // Fetch reviewer by hash
        const { data: reviewerData, error: reviewerError } = await supabase
          .from('document_reviewers')
          .select('*')
          .eq('access_hash', hash)
          .single();

        if (reviewerError || !reviewerData) {
          setError('الرابط غير صالح أو منتهي الصلاحية');
          setLoading(false);
          return;
        }

        setReviewer(reviewerData);

        // Fetch document
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', reviewerData.document_id)
          .single();

        if (docError) throw docError;
        setDocument(docData);

        // Fetch all reviewers for this document
        const { data: allReviewersData } = await supabase
          .from('document_reviewers')
          .select('*')
          .eq('document_id', reviewerData.document_id)
          .order('created_at');

        setAllReviewers(allReviewersData || []);
      } catch (err) {
        console.error('Error:', err);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, hash]);

  const handleApprove = async (signatureData: string) => {
    if (!reviewer) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('document_reviewers')
        .update({
          status: 'approved',
          signature_data: signatureData,
          signed_at: new Date().toISOString(),
        })
        .eq('id', reviewer.id);

      if (error) throw error;

      setReviewer({ ...reviewer, status: 'approved', signature_data: signatureData });
      toast({
        title: 'تم الاعتماد',
        description: 'تم اعتماد المستند وحفظ توقيعك بنجاح',
      });

      // Refresh reviewers list
      const { data } = await supabase
        .from('document_reviewers')
        .select('*')
        .eq('document_id', reviewer.document_id)
        .order('created_at');
      
      setAllReviewers(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الاعتماد',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reviewer || !rejectReason.trim()) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('document_reviewers')
        .update({
          status: 'rejected',
          rejection_reason: rejectReason,
        })
        .eq('id', reviewer.id);

      if (error) throw error;

      setReviewer({ ...reviewer, status: 'rejected', rejection_reason: rejectReason });
      setShowRejectDialog(false);
      toast({
        title: 'تم الرفض',
        description: 'تم رفض المستند',
      });

      // Refresh reviewers list
      const { data } = await supabase
        .from('document_reviewers')
        .select('*')
        .eq('document_id', reviewer.document_id)
        .order('created_at');
      
      setAllReviewers(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الرفض',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[600px] w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document || !reviewer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">خطأ</h2>
            <p className="text-muted-foreground">
              {error || 'لم يتم العثور على المستند'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAlreadyReviewed = reviewer.status !== 'pending';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{document.title || `مستند #${document.number}`}</h1>
              <p className="text-sm text-muted-foreground">مراجعة المستند</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[reviewer.status]}>
                {statusIcons[reviewer.status]}
                <span className="mr-1">{statusLabels[reviewer.status]}</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] overflow-hidden">
              {document.file_url ? (
                <PDFViewer
                  fileUrl={document.file_url}
                  documentId={document.id}
                  readOnly={isAlreadyReviewed}
                  onAddComment={(comment) => {
                    console.log('New comment:', comment);
                  }}
                />
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>لا يوجد ملف مرفق</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reviewer Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  معلومات المراجع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{reviewer.reviewer_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline">{departmentLabels[reviewer.department]}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* All Reviewers Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>حالة المراجعين</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allReviewers.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{r.reviewer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {departmentLabels[r.department]}
                      </p>
                    </div>
                    <Badge className={statusColors[r.status]}>
                      {statusIcons[r.status]}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Signature Panel (only if pending) */}
            {!isAlreadyReviewed && (
              <>
                <SignaturePanel onSign={handleApprove} disabled={submitting} />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={submitting}
                >
                  <XCircle className="w-4 h-4 ml-2" />
                  رفض المستند
                </Button>
              </>
            )}

            {/* Already Reviewed Message */}
            {isAlreadyReviewed && (
              <Card className={reviewer.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                <CardContent className="p-6 text-center">
                  {reviewer.status === 'approved' ? (
                    <>
                      <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
                      <h3 className="font-bold text-green-800">تم الاعتماد</h3>
                      <p className="text-sm text-green-600 mt-1">
                        {reviewer.signed_at && format(new Date(reviewer.signed_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                      </p>
                      {reviewer.signature_data && (
                        <img
                          src={reviewer.signature_data}
                          alt="Signature"
                          className="max-h-20 mx-auto mt-4 border rounded"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-12 h-12 mx-auto text-red-600 mb-3" />
                      <h3 className="font-bold text-red-800">تم الرفض</h3>
                      {reviewer.rejection_reason && (
                        <p className="text-sm text-red-600 mt-2">
                          السبب: {reviewer.rejection_reason}
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض المستند</DialogTitle>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="أدخل سبب الرفض..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : null}
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
