import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  FileText,
  User,
  Calendar,
  DollarSign,
  RefreshCw,
  MessageSquare,
  Check,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';

interface QuoteItem {
  id: string;
  product_name: string;
  product_description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
}

interface QuoteDocument {
  id: string;
  number: string;
  client_name: string;
  client_email: string | null;
  total: number;
  currency: string;
  date: string;
  status: string;
  pdf_url: string | null;
}

export default function QuoteReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<QuoteDocument | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (id) {
      fetchQuoteData();
    }
  }, [id]);

  const fetchQuoteData = async () => {
    setLoading(true);
    try {
      // Fetch document
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (docError) throw docError;
      setDocument(docData);

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from("quote_items")
        .select("*")
        .eq("document_id", id)
        .order("created_at", { ascending: true });

      if (itemsError) throw itemsError;
      // Cast to proper type
      const typedItems = (itemsData || []).map(item => ({
        ...item,
        approval_status: (item.approval_status || 'pending') as ApprovalStatus,
      }));
      setItems(typedItems);
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("فشل في تحميل بيانات عرض السعر");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId: string) => {
    setActionLoading(itemId);
    try {
      const { error } = await supabase
        .from("quote_items")
        .update({
          approval_status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: "العميل",
          rejection_reason: null,
        })
        .eq("id", itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, approval_status: 'approved', approved_at: new Date().toISOString() }
          : item
      ));
      toast.success("تم اعتماد العنصر بنجاح");
    } catch (error) {
      console.error("Error approving item:", error);
      toast.error("فشل في اعتماد العنصر");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedItemId) return;
    
    setActionLoading(selectedItemId);
    try {
      const { error } = await supabase
        .from("quote_items")
        .update({
          approval_status: "rejected",
          rejection_reason: rejectionReason || "مرفوض بدون سبب",
          approved_at: new Date().toISOString(),
          approved_by: "العميل",
        })
        .eq("id", selectedItemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === selectedItemId 
          ? { ...item, approval_status: 'rejected', rejection_reason: rejectionReason }
          : item
      ));
      toast.success("تم رفض العنصر");
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedItemId(null);
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast.error("فشل في رفض العنصر");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectDialog = (itemId: string) => {
    setSelectedItemId(itemId);
    setRejectDialogOpen(true);
  };

  const handleApproveAll = async () => {
    const pendingItems = items.filter(item => item.approval_status === 'pending');
    if (pendingItems.length === 0) {
      toast.info("لا توجد عناصر معلقة");
      return;
    }

    setActionLoading("all");
    try {
      const { error } = await supabase
        .from("quote_items")
        .update({
          approval_status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: "العميل",
        })
        .eq("document_id", id)
        .eq("approval_status", "pending");

      if (error) throw error;

      setItems(items.map(item => 
        item.approval_status === 'pending'
          ? { ...item, approval_status: 'approved', approved_at: new Date().toISOString() }
          : item
      ));
      toast.success(`تم اعتماد ${pendingItems.length} عنصر`);
    } catch (error) {
      console.error("Error approving all:", error);
      toast.error("فشل في اعتماد العناصر");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30"><CheckCircle2 className="w-3 h-3 ml-1" />معتمد</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30"><XCircle className="w-3 h-3 ml-1" />مرفوض</Badge>;
      case 'revision_requested':
        return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30"><MessageSquare className="w-3 h-3 ml-1" />يحتاج مراجعة</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Clock className="w-3 h-3 ml-1" />في انتظار الاعتماد</Badge>;
    }
  };

  const stats = {
    total: items.length,
    approved: items.filter(i => i.approval_status === 'approved').length,
    rejected: items.filter(i => i.approval_status === 'rejected').length,
    pending: items.filter(i => i.approval_status === 'pending').length,
  };

  const formatCurrency = (amount: number, currency: string = "EGP") => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <FileText className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-bold">عرض السعر غير موجود</h2>
        <Button onClick={() => navigate("/quotes")}>
          العودة لعروض الأسعار
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">مراجعة عرض السعر</h1>
              <p className="text-muted-foreground mt-1">
                {document.number} • {document.client_name}
              </p>
            </div>
            <div className="flex gap-2">
              {document.pdf_url && (
                <Button variant="outline" asChild>
                  <a href={document.pdf_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 ml-2" />
                    عرض PDF
                  </a>
                </Button>
              )}
              <Button 
                onClick={handleApproveAll} 
                disabled={actionLoading === "all" || stats.pending === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading === "all" ? (
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                )}
                اعتماد الكل ({stats.pending})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العميل</p>
                <p className="font-medium text-sm">{document.client_name}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">التاريخ</p>
                <p className="font-medium text-sm">{new Date(document.date).toLocaleDateString('ar-EG')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الإجمالي</p>
                <p className="font-medium text-sm">{formatCurrency(document.total, document.currency)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العناصر</p>
                <p className="font-medium text-sm">{stats.approved}/{stats.total} معتمد</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">تقدم الاعتماد</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.approved / stats.total) * 100) || 0}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(stats.approved / stats.total) * 100}%` }}
              />
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
              />
              <div 
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                معتمد ({stats.approved})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                مرفوض ({stats.rejected})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                معلق ({stats.pending})
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className={`transition-all ${
              item.approval_status === 'approved' ? 'border-green-500/30 bg-green-500/5' :
              item.approval_status === 'rejected' ? 'border-red-500/30 bg-red-500/5' :
              ''
            }`}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-foreground">{item.product_name}</h3>
                          {getStatusBadge(item.approval_status)}
                        </div>
                        {item.product_description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.product_description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>الكمية: <strong>{item.quantity}</strong></span>
                          <span>السعر: <strong>{formatCurrency(item.unit_price)}</strong></span>
                          <span>الإجمالي: <strong className="text-primary">{formatCurrency(item.total_price)}</strong></span>
                        </div>
                        {item.rejection_reason && (
                          <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                            سبب الرفض: {item.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {item.approval_status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => openRejectDialog(item.id)}
                        disabled={actionLoading === item.id}
                      >
                        <X className="w-4 h-4 ml-1" />
                        رفض
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(item.id)}
                        disabled={actionLoading === item.id}
                      >
                        {actionLoading === item.id ? (
                          <RefreshCw className="w-4 h-4 ml-1 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 ml-1" />
                        )}
                        اعتماد
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-bold text-lg mb-2">لا توجد عناصر</h3>
                <p className="text-muted-foreground">لم يتم العثور على عناصر في عرض السعر هذا</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>سبب الرفض</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="اكتب سبب رفض هذا العنصر..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleReject} 
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading !== null}
            >
              {actionLoading ? <RefreshCw className="w-4 h-4 ml-2 animate-spin" /> : null}
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
