import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, XCircle, PenTool, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReviewActionsProps {
  documentId: string;
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function ReviewActions({ documentId, currentStatus, onStatusChange }: ReviewActionsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleAction = async (action: 'approve' | 'reject' | 'sign', reason?: string) => {
    setLoading(action);
    try {
      const newStatus = action === 'approve' ? 'approved' : action === 'sign' ? 'signed' : 'needs_fix';
      
      const { error } = await supabase
        .from('documents')
        .update({ status: newStatus })
        .eq('id', documentId);

      if (error) throw error;

      onStatusChange(newStatus);
      toast({
        title: action === 'approve' ? 'تم الاعتماد' : action === 'sign' ? 'تم التوقيع' : 'تم الرفض',
        description: action === 'reject' ? reason : 'تم تحديث حالة المستند',
      });
      setShowRejectDialog(false);
    } catch {
      toast({ title: "خطأ", description: "فشل في تحديث الحالة", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const isActionable = ['in_review', 'ready_to_approve'].includes(currentStatus);

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>إجراءات المراجعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full gap-2"
            onClick={() => handleAction('approve')}
            disabled={!isActionable || loading !== null}
          >
            {loading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            اعتماد
          </Button>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => setShowRejectDialog(true)}
            disabled={!isActionable || loading !== null}
          >
            <XCircle className="w-4 h-4" />
            رفض
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleAction('sign')}
            disabled={currentStatus !== 'approved' || loading !== null}
          >
            {loading === 'sign' ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
            توقيع
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>سبب الرفض</DialogTitle>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="أدخل سبب الرفض..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={() => handleAction('reject', rejectReason)}>
              {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تأكيد الرفض'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
