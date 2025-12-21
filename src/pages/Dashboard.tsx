import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  FileCheck,
  PenTool,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { RecentActivity } from '@/components/documents/RecentActivity';
import { useDocuments, useDocumentStats, useDocumentAuditLogs, Document as DBDocument } from '@/hooks/useDocuments';
import { DocumentStatus } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Transform DB document to UI document format
function transformDocument(doc: DBDocument) {
  return {
    id: doc.id,
    daftraId: doc.daftra_id || '',
    type: doc.type as 'invoice' | 'quote',
    number: doc.number,
    clientName: doc.client_name,
    clientEmail: doc.client_email || '',
    total: doc.total,
    currency: doc.currency,
    date: doc.date,
    status: doc.status as DocumentStatus,
    paymentStatus: doc.payment_status as 'paid' | 'partial' | 'unpaid',
    pdfUrl: doc.pdf_url || undefined,
    htmlUrl: doc.html_url || undefined,
    fileUrl: doc.file_url || undefined,
    syncedAt: doc.synced_at || undefined,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
}

export default function Dashboard() {
  const { data: documents = [], isLoading: docsLoading } = useDocuments();
  const { data: stats, isLoading: statsLoading } = useDocumentStats();
  const { data: auditLogs = [], isLoading: logsLoading } = useDocumentAuditLogs();

  const recentDocuments = documents.slice(0, 4).map(transformDocument);
  
  const transformedLogs = auditLogs.map(log => ({
    id: log.id,
    actorId: log.actor_id || 'system',
    actorName: log.actor_name,
    action: log.action,
    entityType: 'document' as const,
    entityId: log.document_id,
    createdAt: log.created_at,
  }));

  const isLoading = docsLoading || statsLoading || logsLoading;

  if (isLoading) {
    return (
      <MainLayout title="لوحة التحكم" subtitle="جاري التحميل...">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="لوحة التحكم" subtitle="مرحباً بك في نظام إدارة واعتماد المستندات">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="قيد المراجعة"
          value={stats?.inReview || 0}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
          delay={0}
        />
        <StatCard
          title="يحتاج تعديل"
          value={stats?.needsFix || 0}
          icon={<AlertCircle className="w-6 h-6" />}
          variant="danger"
          delay={50}
        />
        <StatCard
          title="جاهز للاعتماد"
          value={stats?.readyToApprove || 0}
          icon={<FileCheck className="w-6 h-6" />}
          variant="success"
          delay={100}
        />
        <StatCard
          title="معتمد اليوم"
          value={stats?.approvedToday || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
          delay={150}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="إجمالي المستندات"
          value={stats?.totalDocuments || 0}
          icon={<FileText className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          delay={200}
        />
        <StatCard
          title="بانتظار التوقيع"
          value={stats?.pendingSignatures || 0}
          icon={<PenTool className="w-6 h-6" />}
          delay={250}
        />
        <StatCard
          title="نسبة الإنجاز الشهري"
          value="87%"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 5, isPositive: true }}
          delay={300}
        />
      </div>

      {/* Recent Documents & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">أحدث المستندات</h2>
            <Button variant="ghost" asChild>
              <Link to="/documents" className="flex items-center gap-1 text-primary">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          {recentDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentDocuments.map((doc, index) => (
                <DocumentCard key={doc.id} document={doc} delay={index * 100} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">لا توجد مستندات بعد</p>
            </div>
          )}
        </div>
        <div>
          <RecentActivity logs={transformedLogs} />
        </div>
      </div>
    </MainLayout>
  );
}
