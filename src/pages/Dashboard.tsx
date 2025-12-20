import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  FileCheck,
  PenTool,
  TrendingUp
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { RecentActivity } from '@/components/documents/RecentActivity';
import { mockDocuments, mockAuditLogs, dashboardStats } from '@/data/mockDocuments';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const recentDocuments = mockDocuments.slice(0, 4);

  return (
    <MainLayout title="لوحة التحكم" subtitle="مرحباً بك في نظام إدارة واعتماد المستندات">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="قيد المراجعة"
          value={dashboardStats.inReview}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
          delay={0}
        />
        <StatCard
          title="يحتاج تعديل"
          value={dashboardStats.needsFix}
          icon={<AlertCircle className="w-6 h-6" />}
          variant="danger"
          delay={50}
        />
        <StatCard
          title="جاهز للاعتماد"
          value={dashboardStats.readyToApprove}
          icon={<FileCheck className="w-6 h-6" />}
          variant="success"
          delay={100}
        />
        <StatCard
          title="معتمد اليوم"
          value={dashboardStats.approvedToday}
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
          value={dashboardStats.totalDocuments}
          icon={<FileText className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          delay={200}
        />
        <StatCard
          title="بانتظار التوقيع"
          value={dashboardStats.pendingSignatures}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDocuments.map((doc, index) => (
              <DocumentCard key={doc.id} document={doc} delay={index * 100} />
            ))}
          </div>
        </div>
        <div>
          <RecentActivity logs={mockAuditLogs} />
        </div>
      </div>
    </MainLayout>
  );
}
