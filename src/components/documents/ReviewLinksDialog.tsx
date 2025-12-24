import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reviewer {
  id: string;
  reviewer_name: string;
  reviewer_email: string;
  department: string;
  access_hash: string;
  status: string;
}

interface ReviewLinksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
  reviewers: Reviewer[];
}

const departmentLabels: Record<string, string> = {
  engineering: 'الهندسة',
  procurement: 'المشتريات',
  accounting: 'الحسابات',
};

const statusLabels: Record<string, string> = {
  pending: 'في الانتظار',
  approved: 'معتمد',
  rejected: 'مرفوض',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  approved: <CheckCircle className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
};

export function ReviewLinksDialog({
  open,
  onOpenChange,
  documentId,
  documentTitle,
  reviewers,
}: ReviewLinksDialogProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const baseUrl = window.location.origin;

  const copyLink = (hash: string, reviewerId: string) => {
    const link = `${baseUrl}/review/${documentId}?hash=${hash}`;
    navigator.clipboard.writeText(link);
    setCopiedId(reviewerId);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرابط إلى الحافظة' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openLink = (hash: string) => {
    const link = `${baseUrl}/review/${documentId}?hash=${hash}`;
    window.open(link, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>روابط المراجعة</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {documentTitle} - شارك هذه الروابط مع المراجعين
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {reviewers.map((reviewer) => (
            <div
              key={reviewer.id}
              className="p-4 rounded-lg border border-border bg-muted/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{departmentLabels[reviewer.department]}</Badge>
                  <span className="font-medium">{reviewer.reviewer_name}</span>
                </div>
                <Badge className={statusColors[reviewer.status]}>
                  {statusIcons[reviewer.status]}
                  <span className="mr-1">{statusLabels[reviewer.status]}</span>
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={`${baseUrl}/review/${documentId}?hash=${reviewer.access_hash}`}
                  readOnly
                  className="text-xs bg-background"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(reviewer.access_hash, reviewer.id)}
                >
                  {copiedId === reviewer.id ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openLink(reviewer.access_hash)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 كل مراجع لديه رابط فريد خاص به. شارك كل رابط مع المراجع المعني فقط.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
