import { Link } from 'react-router-dom';
import { Document, STATUS_LABELS, STATUS_CLASSES, DOCUMENT_TYPE_LABELS } from '@/types/document';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentsTableProps {
  documents: Document[];
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
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
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-right font-bold">رقم المستند</TableHead>
            <TableHead className="text-right font-bold">النوع</TableHead>
            <TableHead className="text-right font-bold">العميل</TableHead>
            <TableHead className="text-right font-bold">التاريخ</TableHead>
            <TableHead className="text-right font-bold">المبلغ</TableHead>
            <TableHead className="text-right font-bold">الحالة</TableHead>
            <TableHead className="text-right font-bold">الدفع</TableHead>
            <TableHead className="text-center font-bold w-24">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow 
              key={doc.id}
              className="hover:bg-muted/30 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">
                <Link 
                  to={`/documents/${doc.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {doc.number}
                </Link>
              </TableCell>
              <TableCell>{DOCUMENT_TYPE_LABELS[doc.type]}</TableCell>
              <TableCell>{doc.clientName}</TableCell>
              <TableCell>{formatDate(doc.date)}</TableCell>
              <TableCell className="font-bold">
                {formatCurrency(doc.total, doc.currency)}
              </TableCell>
              <TableCell>
                <span className={cn("status-badge text-xs", STATUS_CLASSES[doc.status])}>
                  {STATUS_LABELS[doc.status]}
                </span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-xs",
                    doc.paymentStatus === 'paid' && 'border-status-approved text-status-approved',
                    doc.paymentStatus === 'partial' && 'border-status-review text-status-review',
                    doc.paymentStatus === 'unpaid' && 'border-status-needsfix text-status-needsfix'
                  )}
                >
                  {doc.paymentStatus === 'paid' && 'مدفوع'}
                  {doc.paymentStatus === 'partial' && 'جزئي'}
                  {doc.paymentStatus === 'unpaid' && 'غير مدفوع'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    asChild
                  >
                    <Link to={`/documents/${doc.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>إرسال للمراجعة</DropdownMenuItem>
                      <DropdownMenuItem>تحميل PDF</DropdownMenuItem>
                      <DropdownMenuItem>عرض السجل</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
