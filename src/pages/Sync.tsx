import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  ArrowDownToLine,
  History,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SyncLog {
  id: string;
  timestamp: string;
  type: 'invoice' | 'quote' | 'estimate';
  status: 'success' | 'error' | 'pending';
  count: number;
  message: string;
}

const mockSyncLogs: SyncLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:00',
    type: 'invoice',
    status: 'success',
    count: 12,
    message: 'تم مزامنة 12 فاتورة بنجاح',
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:25:00',
    type: 'quote',
    status: 'success',
    count: 5,
    message: 'تم مزامنة 5 عروض أسعار',
  },
  {
    id: '3',
    timestamp: '2024-01-15 10:00:00',
    type: 'invoice',
    status: 'error',
    count: 0,
    message: 'فشل الاتصال بالخادم',
  },
];

const typeLabels: Record<string, string> = {
  invoice: 'فواتير',
  quote: 'عروض أسعار',
  estimate: 'تقديرات',
};

export default function Sync() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState<SyncLog[]>(mockSyncLogs);

  const handleSync = async (type: 'invoice' | 'quote' | 'estimate') => {
    setSyncing(type);
    setSyncProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { data, error } = await supabase.functions.invoke('sync-daftra', {
        body: { documentType: type, page: 1, limit: 50 },
      });

      clearInterval(progressInterval);
      setSyncProgress(100);

      if (error) throw error;

      const newLog: SyncLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('ar-EG'),
        type,
        status: 'success',
        count: data?.synced || 0,
        message: `تم مزامنة ${data?.synced || 0} ${typeLabels[type]} بنجاح`,
      };

      setLogs([newLog, ...logs]);

      toast({
        title: "تمت المزامنة",
        description: newLog.message,
      });
    } catch (error) {
      const newLog: SyncLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('ar-EG'),
        type,
        status: 'error',
        count: 0,
        message: error instanceof Error ? error.message : 'فشل في المزامنة',
      };

      setLogs([newLog, ...logs]);

      toast({
        title: "خطأ في المزامنة",
        description: newLog.message,
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
      setSyncProgress(0);
    }
  };

  const handleSyncAll = async () => {
    await handleSync('invoice');
    await handleSync('quote');
    await handleSync('estimate');
  };

  return (
    <MainLayout title="المزامنة" subtitle="مزامنة المستندات من دفترة">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">آخر مزامنة</p>
                <p className="font-bold">منذ 5 دقائق</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-status-approved/10">
                <CheckCircle className="w-6 h-6 text-[hsl(var(--status-approved))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مزامنات ناجحة</p>
                <p className="font-bold text-[hsl(var(--status-approved))]">
                  {logs.filter(l => l.status === 'success').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">أخطاء</p>
                <p className="font-bold text-destructive">
                  {logs.filter(l => l.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المستندات</p>
                <p className="font-bold">
                  {logs.filter(l => l.status === 'success').reduce((acc, l) => acc + l.count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              الفواتير
            </CardTitle>
            <CardDescription>مزامنة الفواتير من دفترة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSync('invoice')}
              disabled={syncing !== null}
              className="w-full gap-2"
            >
              {syncing === 'invoice' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
              مزامنة الفواتير
            </Button>
            {syncing === 'invoice' && (
              <Progress value={syncProgress} className="mt-4" />
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              عروض الأسعار
            </CardTitle>
            <CardDescription>مزامنة عروض الأسعار من دفترة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSync('quote')}
              disabled={syncing !== null}
              className="w-full gap-2"
              variant="secondary"
            >
              {syncing === 'quote' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
              مزامنة العروض
            </Button>
            {syncing === 'quote' && (
              <Progress value={syncProgress} className="mt-4" />
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              التقديرات
            </CardTitle>
            <CardDescription>مزامنة التقديرات من دفترة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleSync('estimate')}
              disabled={syncing !== null}
              className="w-full gap-2"
              variant="outline"
            >
              {syncing === 'estimate' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
              مزامنة التقديرات
            </Button>
            {syncing === 'estimate' && (
              <Progress value={syncProgress} className="mt-4" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sync All Button */}
      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          onClick={handleSyncAll}
          disabled={syncing !== null}
          className="gap-2 px-8"
        >
          <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
          مزامنة الكل
        </Button>
      </div>

      {/* Sync History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            سجل المزامنة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
              >
                <div className="flex items-center gap-4">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-[hsl(var(--status-approved))]" />
                  ) : log.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{log.message}</p>
                    <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{typeLabels[log.type]}</Badge>
                  <Badge
                    variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}
                  >
                    {log.status === 'success' ? 'نجاح' : log.status === 'error' ? 'فشل' : 'جاري'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
