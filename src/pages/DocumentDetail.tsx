import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDocument, useDocumentComments, useDocumentVersions, useDocumentAuditLogs, useAddComment, useUpdateDocumentStatus } from '@/hooks/useDocuments';
import { STATUS_LABELS, STATUS_CLASSES, DOCUMENT_TYPE_LABELS, DocumentStatus } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  History, 
  Shield,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  PenTool,
  Calendar,
  Building2,
  Mail,
  DollarSign,
  Clock,
  Loader2,
  Package,
  CreditCard,
  Hash,
  User,
  Printer
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuoteItem {
  id: string;
  product_name: string;
  product_description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  approval_status: string | null;
}

export default function DocumentDetail() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  
  const { data: document, isLoading } = useDocument(id || '');
  const { data: comments = [] } = useDocumentComments(id || '');
  const { data: versions = [] } = useDocumentVersions(id || '');
  const { data: auditLogs = [] } = useDocumentAuditLogs(id);
  
  const addComment = useAddComment();
  const updateStatus = useUpdateDocumentStatus();

  // Fetch quote items from database
  useEffect(() => {
    const fetchItems = async () => {
      if (!id) return;
      setItemsLoading(true);
      try {
        const { data, error } = await supabase
          .from('quote_items')
          .select('*')
          .eq('document_id', id)
          .order('created_at', { ascending: true });
        
        if (!error && data) {
          setItems(data as QuoteItem[]);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setItemsLoading(false);
      }
    };
    
    fetchItems();
  }, [id]);

  // Extract items from raw_json if no items in database
  const getItemsFromDocument = (): QuoteItem[] => {
    if (items.length > 0) return items;
    
    if (document?.raw_json) {
      const rawJson = document.raw_json as Record<string, unknown>;
      const docWrapper = rawJson.Quote || rawJson.Invoice || rawJson.Estimate || rawJson;
      const rawItems = (docWrapper as Record<string, unknown>)?.QuoteItem || 
                       (docWrapper as Record<string, unknown>)?.InvoiceItem || 
                       (docWrapper as Record<string, unknown>)?.EstimateItem || [];
      
      if (Array.isArray(rawItems)) {
        return rawItems.map((item: Record<string, unknown>, index) => ({
          id: String(item.id || index),
          // Daftra uses 'item' field for product name
          product_name: String(item.item || item.product || item.product_name || item.name || item.description || 'منتج/خدمة'),
          product_description: item.description ? String(item.description) : null,
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.unit_price) || Number(item.price) || 0,
          total_price: Number(item.subtotal) || Number(item.total) || (Number(item.quantity) * Number(item.unit_price)) || 0,
          approval_status: null,
        }));
      }
    }
    return [];
  };

  const displayItems = getItemsFromDocument();

  const handleAddComment = () => {
    if (!newComment.trim() || !id) return;
    
    addComment.mutate({
      document_id: id,
      text: newComment,
      user_name: 'المستخدم الحالي',
    }, {
      onSuccess: () => setNewComment(''),
    });
  };

  const handleStatusUpdate = (status: string) => {
    if (!id) return;
    updateStatus.mutate({ id, status });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <MainLayout title="جاري التحميل...">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!document) {
    return (
      <MainLayout title="المستند غير موجود">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لم يتم العثور على المستند المطلوب</p>
          <Button asChild className="mt-4">
            <Link to="/documents">العودة للمستندات</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatCurrency = (amount: number, currency: string = 'EGP') => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatShortDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const docType = document.type as 'invoice' | 'quote';
  const docStatus = document.status as DocumentStatus;

  // Calculate totals from items
  const subtotal = displayItems.reduce((sum, item) => sum + item.total_price, 0);
  const useCalculatedTotal = subtotal > 0 ? subtotal : document.total;

  // Payment status styling
  const paymentStatusLabels: Record<string, string> = {
    paid: 'مدفوع بالكامل',
    partial: 'مدفوع جزئياً',
    unpaid: 'غير مدفوع',
  };

  const paymentStatusClasses: Record<string, string> = {
    paid: 'bg-green-500/10 text-green-600 border-green-500/30',
    partial: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    unpaid: 'bg-red-500/10 text-red-600 border-red-500/30',
  };

  return (
    <MainLayout title={document.number} subtitle={DOCUMENT_TYPE_LABELS[docType]}>
      {/* Back Button */}
      <Link 
        to="/documents" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors print:hidden"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمستندات
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Preview - Custom Design */}
          <Card className="animate-fade-in overflow-hidden">
            {/* Document Header */}
            <CardHeader className="bg-gradient-to-l from-primary/5 to-primary/10 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{DOCUMENT_TYPE_LABELS[docType]}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1 font-mono">{document.number}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 print:hidden" onClick={handlePrint}>
                  <Printer className="w-4 h-4" />
                  طباعة
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Document Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    العميل
                  </p>
                  <p className="font-semibold text-sm">{document.client_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    التاريخ
                  </p>
                  <p className="font-semibold text-sm">{formatShortDate(document.date)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    الإجمالي
                  </p>
                  <p className="font-bold text-primary text-lg">{formatCurrency(useCalculatedTotal, document.currency)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    حالة الدفع
                  </p>
                  <Badge className={paymentStatusClasses[document.payment_status] || paymentStatusClasses.unpaid}>
                    {paymentStatusLabels[document.payment_status] || 'غير محدد'}
                  </Badge>
                </div>
              </div>

              {document.client_email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {document.client_email}
                </div>
              )}

              <Separator />

              {/* Items Table */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  العناصر والمنتجات
                </h3>
                
                {itemsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : displayItems.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12 text-center">#</TableHead>
                          <TableHead>المنتج/الخدمة</TableHead>
                          <TableHead className="text-center">الكمية</TableHead>
                          <TableHead className="text-left">سعر الوحدة</TableHead>
                          <TableHead className="text-left">الإجمالي</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-center font-medium text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                {item.product_description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {item.product_description}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-left font-mono text-sm">
                              {formatCurrency(item.unit_price, document.currency)}
                            </TableCell>
                            <TableCell className="text-left font-mono font-semibold">
                              {formatCurrency(item.total_price, document.currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* Totals */}
                    <div className="bg-muted/30 p-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">المجموع الكلي</span>
                        <span className="font-bold text-2xl text-primary">
                          {formatCurrency(useCalculatedTotal, document.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">لا توجد عناصر مسجلة</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      قم بمزامنة البيانات من دفترة لعرض العناصر
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="comments" className="animate-slide-up print:hidden" style={{ animationDelay: '100ms' }}>
            <TabsList className="w-full justify-start bg-muted/50 p-1">
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                التعليقات ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="versions" className="gap-2">
                <History className="w-4 h-4" />
                الإصدارات ({versions.length})
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <Shield className="w-4 h-4" />
                سجل التدقيق
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  {/* New Comment */}
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        م
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="أضف تعليقك هنا..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button 
                          size="sm" 
                          className="gap-2"
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || addComment.isPending}
                        >
                          {addComment.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          إرسال
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="border-t border-border pt-4 space-y-4">
                    {comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">لا توجد تعليقات بعد</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                              {comment.user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.user_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="versions" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {versions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">لا توجد إصدارات</p>
                  ) : (
                    <div className="space-y-3">
                      {versions.map((version) => (
                        <div 
                          key={version.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="font-bold text-primary">v{version.version_number}</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">الإصدار {version.version_number}</p>
                              <p className="text-xs text-muted-foreground">
                                {version.created_by || 'النظام'} • {formatDate(version.created_at)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{version.source === 'daftra' ? 'دفترة' : 'رفع يدوي'}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {auditLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">لا يوجد سجل</p>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs.map((log) => (
                        <div 
                          key={log.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{log.actor_name}</span>
                              {' '}
                              <span className="text-muted-foreground">{log.action}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(log.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 print:hidden">
          {/* Status & Actions */}
          <Card className="animate-slide-up" style={{ animationDelay: '50ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">الحالة</span>
                <span className={cn("status-badge", STATUS_CLASSES[docStatus])}>
                  {STATUS_LABELS[docStatus]}
                </span>
              </div>

              <div className="space-y-2">
                {document.status === 'in_review' && (
                  <>
                    <Button 
                      className="w-full gap-2" 
                      variant="default"
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={updateStatus.isPending}
                    >
                      {updateStatus.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      اعتماد المستند
                    </Button>
                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => handleStatusUpdate('needs_fix')}
                      disabled={updateStatus.isPending}
                    >
                      <AlertCircle className="w-4 h-4" />
                      طلب تعديل
                    </Button>
                  </>
                )}
                {document.status === 'ready_to_approve' && (
                  <Button 
                    className="w-full gap-2" 
                    variant="default"
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updateStatus.isPending}
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    اعتماد المستند
                  </Button>
                )}
                {document.status === 'approved' && (
                  <Button 
                    className="w-full gap-2" 
                    variant="default"
                    onClick={() => handleStatusUpdate('signed')}
                    disabled={updateStatus.isPending}
                  >
                    <PenTool className="w-4 h-4" />
                    توقيع المستند
                  </Button>
                )}
                {document.status === 'draft' && (
                  <Button 
                    className="w-full gap-2" 
                    variant="default"
                    onClick={() => handleStatusUpdate('in_review')}
                    disabled={updateStatus.isPending}
                  >
                    <Send className="w-4 h-4" />
                    إرسال للمراجعة
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Document Info */}
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-base">معلومات المستند</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">رقم المستند</p>
                  <p className="font-mono font-medium">{document.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">العميل</p>
                  <p className="font-medium">{document.client_name}</p>
                </div>
              </div>
              {document.client_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                    <p className="text-sm">{document.client_email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
                  <p className="font-medium">{formatShortDate(document.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
                  <p className="font-bold text-primary text-lg">
                    {formatCurrency(useCalculatedTotal, document.currency)}
                  </p>
                </div>
              </div>
              {document.synced_at && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">آخر مزامنة</p>
                    <p className="text-sm">{formatDate(document.synced_at)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Summary */}
          {displayItems.length > 0 && (
            <Card className="animate-slide-up" style={{ animationDelay: '150ms' }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  ملخص العناصر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد العناصر</span>
                  <span className="font-medium">{displayItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">إجمالي الكميات</span>
                  <span className="font-medium">
                    {displayItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">المجموع</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(useCalculatedTotal, document.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
