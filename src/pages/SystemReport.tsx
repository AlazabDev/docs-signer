import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Database,
  Cloud,
  FileText,
  Users,
  Mail,
  Shield,
  Clock,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemCheck {
  name: string;
  nameAr: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
  action?: { label: string; href: string };
}

interface SystemStats {
  totalDocuments: number;
  syncedDocuments: number;
  pendingReview: number;
  approved: number;
  totalUsers: number;
  lastSync: string | null;
}

export default function SystemReport() {
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const runSystemCheck = async () => {
    setIsLoading(true);
    const newChecks: SystemCheck[] = [];

    // 1. Database Connection Check
    try {
      const { count, error } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      newChecks.push({
        name: 'Database',
        nameAr: 'قاعدة البيانات',
        status: 'success',
        message: 'متصل بنجاح',
        details: `${count || 0} مستند في النظام`
      });
    } catch (err) {
      newChecks.push({
        name: 'Database',
        nameAr: 'قاعدة البيانات',
        status: 'error',
        message: 'فشل الاتصال',
        details: err instanceof Error ? err.message : 'خطأ غير معروف'
      });
    }

    // 2. Daftra Sync Check
    try {
      const { data: syncedDocs, error } = await supabase
        .from('documents')
        .select('id, synced_at, daftra_id')
        .not('daftra_id', 'is', null)
        .order('synced_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      const syncedCount = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .not('daftra_id', 'is', null);

      const count = syncedCount.count || 0;
      
      if (count > 0) {
        newChecks.push({
          name: 'Daftra Sync',
          nameAr: 'مزامنة دفترة',
          status: 'success',
          message: `${count} فاتورة متزامنة`,
          details: syncedDocs?.[0]?.synced_at 
            ? `آخر مزامنة: ${new Date(syncedDocs[0].synced_at).toLocaleString('ar-EG')}`
            : undefined,
          action: { label: 'فتح المزامنة', href: '/sync' }
        });
      } else {
        newChecks.push({
          name: 'Daftra Sync',
          nameAr: 'مزامنة دفترة',
          status: 'warning',
          message: 'لا توجد فواتير متزامنة',
          details: 'يرجى تشغيل المزامنة لسحب البيانات من دفترة',
          action: { label: 'مزامنة الآن', href: '/sync' }
        });
      }
    } catch (err) {
      newChecks.push({
        name: 'Daftra Sync',
        nameAr: 'مزامنة دفترة',
        status: 'error',
        message: 'فشل فحص المزامنة',
        details: err instanceof Error ? err.message : 'خطأ غير معروف'
      });
    }

    // 3. Document Storage Check
    try {
      const { data: buckets, error } = await supabase
        .storage
        .listBuckets();
      
      if (error) throw error;
      
      const documentsBucket = buckets?.find(b => b.name === 'documents');
      if (documentsBucket) {
        newChecks.push({
          name: 'Storage',
          nameAr: 'التخزين السحابي',
          status: 'success',
          message: 'تخزين المستندات جاهز',
          details: 'bucket: documents'
        });
      } else {
        newChecks.push({
          name: 'Storage',
          nameAr: 'التخزين السحابي',
          status: 'warning',
          message: 'لم يتم العثور على مخزن المستندات',
          details: 'قد لا يعمل رفع الملفات'
        });
      }
    } catch (err) {
      newChecks.push({
        name: 'Storage',
        nameAr: 'التخزين السحابي',
        status: 'error',
        message: 'فشل الوصول للتخزين',
        details: err instanceof Error ? err.message : 'خطأ غير معروف'
      });
    }

    // 4. Edge Functions Check
    try {
      const response = await fetch(
        `https://zrrffsjbfkphridqyais.supabase.co/functions/v1/sync-daftra`,
        {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.ok || response.status === 204) {
        newChecks.push({
          name: 'Edge Functions',
          nameAr: 'الوظائف السحابية',
          status: 'success',
          message: 'sync-daftra جاهز',
          action: { label: 'عرض السجلات', href: 'https://supabase.com/dashboard/project/zrrffsjbfkphridqyais/functions/sync-daftra/logs' }
        });
      } else {
        newChecks.push({
          name: 'Edge Functions',
          nameAr: 'الوظائف السحابية',
          status: 'warning',
          message: `حالة: ${response.status}`,
        });
      }
    } catch {
      newChecks.push({
        name: 'Edge Functions',
        nameAr: 'الوظائف السحابية',
        status: 'warning',
        message: 'قد يكون هناك مشكلة في الوظائف',
        details: 'تحقق من إعدادات CORS'
      });
    }

    // 5. Document Workflow Check
    try {
      const { data: statuses, error } = await supabase
        .from('documents')
        .select('status')
        .limit(1000);
      
      if (error) throw error;
      
      const statusCounts = (statuses || []).reduce((acc: Record<string, number>, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      }, {});
      
      const inReview = statusCounts['in_review'] || 0;
      const needsFix = statusCounts['needs_fix'] || 0;
      const approved = statusCounts['approved'] || 0;
      
      newChecks.push({
        name: 'Workflow',
        nameAr: 'سير العمل',
        status: needsFix > 5 ? 'warning' : 'success',
        message: `${inReview} قيد المراجعة، ${approved} معتمد`,
        details: needsFix > 0 ? `${needsFix} مستند يحتاج إصلاح` : undefined,
        action: { label: 'عرض المستندات', href: '/documents' }
      });
    } catch (err) {
      newChecks.push({
        name: 'Workflow',
        nameAr: 'سير العمل',
        status: 'error',
        message: 'فشل فحص سير العمل',
      });
    }

    // 6. Email Integration Check (Resend)
    newChecks.push({
      name: 'Email',
      nameAr: 'البريد الإلكتروني',
      status: 'warning',
      message: 'يتطلب إعداد RESEND_API_KEY',
      details: 'أضف مفتاح Resend API لتفعيل إرسال البريد',
      action: { label: 'إعداد الأسرار', href: 'https://supabase.com/dashboard/project/zrrffsjbfkphridqyais/settings/functions' }
    });

    // Calculate stats
    try {
      const { count: totalDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });
      
      const { count: syncedDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .not('daftra_id', 'is', null);
      
      const { count: pendingDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_review');
      
      const { count: approvedDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      const { data: lastSyncDoc } = await supabase
        .from('documents')
        .select('synced_at')
        .not('synced_at', 'is', null)
        .order('synced_at', { ascending: false })
        .limit(1);
      
      setStats({
        totalDocuments: totalDocs || 0,
        syncedDocuments: syncedDocs || 0,
        pendingReview: pendingDocs || 0,
        approved: approvedDocs || 0,
        totalUsers: 0,
        lastSync: lastSyncDoc?.[0]?.synced_at || null
      });
    } catch {
      // Stats failed
    }

    setChecks(newChecks);
    setIsLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    runSystemCheck();
  }, []);

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[hsl(var(--status-approved))]" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[hsl(var(--status-needsfix))]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[hsl(var(--status-review))]" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin" />;
    }
  };

  const getStatusBadge = (status: SystemCheck['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-status-approved/20 text-[hsl(var(--status-approved))]">يعمل</Badge>;
      case 'error':
        return <Badge className="bg-status-needsfix/20 text-[hsl(var(--status-needsfix))]">خطأ</Badge>;
      case 'warning':
        return <Badge className="bg-status-review/20 text-[hsl(var(--status-review))]">تحذير</Badge>;
      default:
        return <Badge>جاري الفحص</Badge>;
    }
  };

  const getComponentIcon = (name: string) => {
    switch (name) {
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Daftra Sync': return <Cloud className="w-5 h-5" />;
      case 'Storage': return <FileText className="w-5 h-5" />;
      case 'Edge Functions': return <Shield className="w-5 h-5" />;
      case 'Workflow': return <Clock className="w-5 h-5" />;
      case 'Email': return <Mail className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const successCount = checks.filter(c => c.status === 'success').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const errorCount = checks.filter(c => c.status === 'error').length;

  return (
    <MainLayout title="تقرير حالة النظام" subtitle="فحص شامل لجميع مكونات النظام">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          آخر تحديث: {lastRefresh.toLocaleString('ar-EG')}
        </div>
        <Button onClick={runSystemCheck} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          تحديث التقرير
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card border-[hsl(var(--status-approved))]">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--status-approved))]" />
            <p className="text-2xl font-bold text-[hsl(var(--status-approved))]">{successCount}</p>
            <p className="text-sm text-muted-foreground">يعمل بنجاح</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-[hsl(var(--status-review))]">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--status-review))]" />
            <p className="text-2xl font-bold text-[hsl(var(--status-review))]">{warningCount}</p>
            <p className="text-sm text-muted-foreground">يحتاج انتباه</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-[hsl(var(--status-needsfix))]">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--status-needsfix))]" />
            <p className="text-2xl font-bold text-[hsl(var(--status-needsfix))]">{errorCount}</p>
            <p className="text-sm text-muted-foreground">أخطاء</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats?.totalDocuments || 0}</p>
            <p className="text-sm text-muted-foreground">إجمالي المستندات</p>
          </CardContent>
        </Card>
      </div>

      {/* System Stats */}
      {stats && (
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              إحصائيات النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xl font-bold">{stats.totalDocuments}</p>
                <p className="text-xs text-muted-foreground">إجمالي المستندات</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xl font-bold">{stats.syncedDocuments}</p>
                <p className="text-xs text-muted-foreground">متزامن من دفترة</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xl font-bold">{stats.pendingReview}</p>
                <p className="text-xs text-muted-foreground">قيد المراجعة</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">معتمد</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">
                  {stats.lastSync 
                    ? new Date(stats.lastSync).toLocaleDateString('ar-EG')
                    : 'لم تتم'}
                </p>
                <p className="text-xs text-muted-foreground">آخر مزامنة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Checks Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>تفاصيل فحص المكونات</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="mr-3">جاري فحص النظام...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">المكون</th>
                    <th className="text-right py-3 px-4">الحالة</th>
                    <th className="text-right py-3 px-4">الرسالة</th>
                    <th className="text-right py-3 px-4">التفاصيل</th>
                    <th className="text-center py-3 px-4">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((check, index) => (
                    <tr 
                      key={check.name}
                      className={cn(
                        "border-b hover:bg-muted/30 transition-colors",
                        index % 2 === 0 ? 'bg-muted/10' : ''
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getComponentIcon(check.name)}
                          <div>
                            <p className="font-medium">{check.nameAr}</p>
                            <p className="text-xs text-muted-foreground">{check.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(check.status)}
                          {getStatusBadge(check.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{check.message}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {check.details || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {check.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-1"
                          >
                            <a 
                              href={check.action.href}
                              target={check.action.href.startsWith('http') ? '_blank' : undefined}
                              rel={check.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {check.action.label}
                              {check.action.href.startsWith('http') && (
                                <ExternalLink className="w-3 h-3" />
                              )}
                            </a>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--status-review))]" />
            التوصيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {checks.filter(c => c.status === 'warning' || c.status === 'error').length === 0 ? (
              <li className="flex items-center gap-2 text-[hsl(var(--status-approved))]">
                <CheckCircle2 className="w-4 h-4" />
                النظام يعمل بشكل سليم! لا توجد مشاكل.
              </li>
            ) : (
              checks
                .filter(c => c.status === 'warning' || c.status === 'error')
                .map(check => (
                  <li key={check.name} className="flex items-start gap-2">
                    {check.status === 'error' ? (
                      <XCircle className="w-4 h-4 text-[hsl(var(--status-needsfix))] mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[hsl(var(--status-review))] mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{check.nameAr}: {check.message}</p>
                      {check.details && (
                        <p className="text-sm text-muted-foreground">{check.details}</p>
                      )}
                    </div>
                  </li>
                ))
            )}
          </ul>
        </CardContent>
      </Card>
    </MainLayout>
  );
}