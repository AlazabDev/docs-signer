import { AuditLog } from '@/types/document';
import { 
  MessageSquare, 
  RefreshCw, 
  Send, 
  CheckCircle,
  FileEdit,
  PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  logs: AuditLog[];
}

const getActionIcon = (action: string) => {
  if (action.includes('تعليق')) return MessageSquare;
  if (action.includes('مزامنة')) return RefreshCw;
  if (action.includes('أرسل')) return Send;
  if (action.includes('اعتمد')) return CheckCircle;
  if (action.includes('وقّع')) return PenTool;
  return FileEdit;
};

const getActionColor = (action: string) => {
  if (action.includes('تعليق')) return 'bg-accent/20 text-accent';
  if (action.includes('مزامنة')) return 'bg-primary/20 text-primary';
  if (action.includes('أرسل')) return 'bg-status-review/20 text-status-review';
  if (action.includes('اعتمد')) return 'bg-status-approved/20 text-status-approved';
  if (action.includes('وقّع')) return 'bg-status-signed/20 text-status-signed';
  return 'bg-muted text-muted-foreground';
};

export function RecentActivity({ logs }: RecentActivityProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <h3 className="font-bold text-lg mb-4">النشاط الأخير</h3>
      <div className="space-y-4">
        {logs.map((log, index) => {
          const Icon = getActionIcon(log.action);
          const colorClass = getActionColor(log.action);
          
          return (
            <div 
              key={log.id} 
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("p-2 rounded-lg flex-shrink-0", colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{log.actorName}</span>
                  {' '}
                  <span className="text-muted-foreground">{log.action}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatTime(log.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
