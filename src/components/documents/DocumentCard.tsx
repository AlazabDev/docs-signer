import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Building2, 
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { Document, STATUS_LABELS, STATUS_CLASSES, DOCUMENT_TYPE_LABELS } from '@/types/document';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DocumentCardProps {
  document: Document;
  delay?: number;
}

export function DocumentCard({ document, delay = 0 }: DocumentCardProps) {
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
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <Link 
      to={`/documents/${document.id}`}
      className="block animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {document.number}
              </h3>
              <p className="text-sm text-muted-foreground">
                {DOCUMENT_TYPE_LABELS[document.type]}
              </p>
            </div>
          </div>
          <span className={cn("status-badge", STATUS_CLASSES[document.status])}>
            {STATUS_LABELS[document.status]}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{document.clientName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(document.date)}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-bold text-lg text-foreground">
                {formatCurrency(document.total, document.currency)}
              </span>
            </div>
            
            <Badge 
              variant={
                document.paymentStatus === 'paid' 
                  ? 'default' 
                  : document.paymentStatus === 'partial' 
                  ? 'secondary' 
                  : 'outline'
              }
              className={cn(
                document.paymentStatus === 'paid' && 'bg-status-approved text-white',
                document.paymentStatus === 'partial' && 'bg-status-review text-white',
                document.paymentStatus === 'unpaid' && 'border-status-needsfix text-status-needsfix'
              )}
            >
              {document.paymentStatus === 'paid' && 'مدفوع'}
              {document.paymentStatus === 'partial' && 'جزئي'}
              {document.paymentStatus === 'unpaid' && 'غير مدفوع'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-end mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">عرض التفاصيل</span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </div>
      </div>
    </Link>
  );
}
