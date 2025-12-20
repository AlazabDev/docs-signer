import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockDocuments, mockComments, mockVersions, mockAuditLogs } from '@/data/mockDocuments';
import { STATUS_LABELS, STATUS_CLASSES, DOCUMENT_TYPE_LABELS } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  History, 
  Shield,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  PenTool,
  ExternalLink,
  Calendar,
  Building2,
  Mail,
  DollarSign,
  Clock
} from 'lucide-react';
import { useState } from 'react';

export default function DocumentDetail() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  
  const document = mockDocuments.find(d => d.id === id);
  const comments = mockComments.filter(c => c.documentId === id);
  const versions = mockVersions.filter(v => v.documentId === id);
  const auditLogs = mockAuditLogs.filter(l => l.entityId === id);

  if (!document) {
    return (
      <MainLayout title="المستند غير موجود">
        <div className="text-center py-12">
          <p className="text-muted-foreground">لم يتم العثور على المستند المطلوب</p>
          <Button asChild className="mt-4">
            <Link to="/documents">العودة للمستندات</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatShortDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <MainLayout title={document.number} subtitle={DOCUMENT_TYPE_LABELS[document.type]}>
      {/* Back Button */}
      <Link 
        to="/documents" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمستندات
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Preview */}
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">معاينة المستند</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  تحميل
                </Button>
                {document.htmlUrl && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={document.htmlUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      فتح في دفترة
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="aspect-[3/4] bg-gradient-to-b from-muted/30 to-muted/10 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">معاينة المستند</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  سيتم عرض PDF هنا عند الاتصال بـ Lovable Cloud
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="comments" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <TabsList className="w-full justify-start bg-muted/50 p-1">
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                التعليقات ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="versions" className="gap-2">
                <History className="w-4 h-4" />
                الإصدارات ({versions.length})
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <Shield className="w-4 h-4" />
                سجل التدقيق
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-4">
              <div className="glass-card rounded-xl p-4 space-y-4">
                {/* New Comment */}
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      أم
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="أضف تعليقك هنا..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" className="gap-2">
                        <Send className="w-4 h-4" />
                        إرسال
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="border-t border-border pt-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                          {comment.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="versions" className="mt-4">
              <div className="glass-card rounded-xl p-4">
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div 
                      key={version.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">v{version.versionNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">الإصدار {version.versionNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {version.createdBy} • {formatDate(version.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{version.source === 'daftra' ? 'دفترة' : 'رفع يدوي'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="mt-4">
              <div className="glass-card rounded-xl p-4">
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{log.actorName}</span>
                          {' '}
                          <span className="text-muted-foreground">{log.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <div className="glass-card rounded-xl p-5 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">الحالة</span>
              <span className={cn("status-badge", STATUS_CLASSES[document.status])}>
                {STATUS_LABELS[document.status]}
              </span>
            </div>

            <div className="space-y-2">
              {document.status === 'in_review' && (
                <>
                  <Button className="w-full gap-2" variant="default">
                    <CheckCircle className="w-4 h-4" />
                    اعتماد المستند
                  </Button>
                  <Button className="w-full gap-2" variant="outline">
                    <AlertCircle className="w-4 h-4" />
                    طلب تعديل
                  </Button>
                </>
              )}
              {document.status === 'ready_to_approve' && (
                <Button className="w-full gap-2" variant="default">
                  <CheckCircle className="w-4 h-4" />
                  اعتماد المستند
                </Button>
              )}
              {document.status === 'approved' && (
                <Button className="w-full gap-2" variant="default">
                  <PenTool className="w-4 h-4" />
                  توقيع المستند
                </Button>
              )}
            </div>
          </div>

          {/* Document Info */}
          <div className="glass-card rounded-xl p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-bold mb-4">تفاصيل المستند</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">العميل</p>
                  <p className="font-medium">{document.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                  <p className="text-sm">{document.clientEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
                  <p className="font-medium">{formatShortDate(document.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
                  <p className="font-bold text-lg text-primary">
                    {formatCurrency(document.total, document.currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">آخر مزامنة</p>
                  <p className="text-sm">{formatDate(document.syncedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="glass-card rounded-xl p-5 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h3 className="font-bold mb-3">حالة الدفع</h3>
            <Badge 
              className={cn(
                "w-full justify-center py-2 text-sm",
                document.paymentStatus === 'paid' && 'bg-status-approved hover:bg-status-approved',
                document.paymentStatus === 'partial' && 'bg-status-review hover:bg-status-review',
                document.paymentStatus === 'unpaid' && 'bg-status-needsfix hover:bg-status-needsfix'
              )}
            >
              {document.paymentStatus === 'paid' && 'مدفوع بالكامل'}
              {document.paymentStatus === 'partial' && 'مدفوع جزئياً'}
              {document.paymentStatus === 'unpaid' && 'غير مدفوع'}
            </Badge>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
