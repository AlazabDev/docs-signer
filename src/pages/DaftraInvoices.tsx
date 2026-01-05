import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDocuments, Document } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  RefreshCw,
  Loader2,
  Eye,
  ExternalLink,
  Download,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DaftraInvoiceDetails {
  Invoice?: {
    id: number;
    no: string;
    date: string;
    due_date: string;
    summary_total: number;
    summary_subtotal: number;
    summary_paid: number;
    summary_unpaid: number;
    summary_discount: number;
    currency_code: string;
    payment_status: number;
    invoice_pdf_url: string;
    invoice_html_url: string;
    notes: string;
    html_notes: string;
    Client?: {
      id: number;
      first_name: string;
      last_name: string;
      business_name: string;
      email: string;
      phone1: string;
      phone2: string;
      address1: string;
      address2: string;
      city: string;
      country_code: string;
      client_number: string;
    };
    InvoiceItem?: Array<{
      id: number;
      product_id: number;
      product_name: string;
      description: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  };
}

export default function DaftraInvoices() {
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Document | null>(null);
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, refetch } = useDocuments();

  // Filter only synced documents from Daftra
  const daftraDocuments = documents.filter(
    doc => doc.daftra_id || (doc.raw_json as DaftraInvoiceDetails)?.Invoice
  );

  const filteredDocuments = daftraDocuments.filter(doc => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      doc.number.toLowerCase().includes(searchLower) ||
      doc.client_name.toLowerCase().includes(searchLower)
    );
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('sync-daftra', {
        body: { type: 'invoices', page: 1, limit: 100 },
      });
      
      if (error) throw error;
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      toast.success('تمت مزامنة الفواتير بنجاح');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('فشلت المزامنة');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EGP') => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-status-approved/20 text-[hsl(var(--status-approved))]">مدفوع</Badge>;
      case 'partial':
        return <Badge className="bg-status-review/20 text-[hsl(var(--status-review))]">جزئي</Badge>;
      default:
        return <Badge className="bg-status-needsfix/20 text-[hsl(var(--status-needsfix))]">غير مدفوع</Badge>;
    }
  };

  const getInvoiceDetails = (doc: Document): DaftraInvoiceDetails | null => {
    if (!doc.raw_json) return null;
    return doc.raw_json as DaftraInvoiceDetails;
  };

  return (
    <MainLayout 
      title="فواتير دفترة" 
      subtitle={`${filteredDocuments.length} فاتورة مسحوبة من دفترة`}
    >
      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم الفاتورة أو اسم العميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Sync Button */}
          <Button 
            className="gap-2"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            مزامنة من دفترة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الفواتير</p>
                <p className="font-bold text-xl">{daftraDocuments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-status-approved/10">
                <DollarSign className="w-6 h-6 text-[hsl(var(--status-approved))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مدفوع</p>
                <p className="font-bold text-xl text-[hsl(var(--status-approved))]">
                  {daftraDocuments.filter(d => d.payment_status === 'paid').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-status-review/10">
                <DollarSign className="w-6 h-6 text-[hsl(var(--status-review))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">جزئي</p>
                <p className="font-bold text-xl text-[hsl(var(--status-review))]">
                  {daftraDocuments.filter(d => d.payment_status === 'partial').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-status-needsfix/10">
                <DollarSign className="w-6 h-6 text-[hsl(var(--status-needsfix))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">غير مدفوع</p>
                <p className="font-bold text-xl text-[hsl(var(--status-needsfix))]">
                  {daftraDocuments.filter(d => d.payment_status === 'unpaid').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-right font-bold">رقم الفاتورة</TableHead>
                <TableHead className="text-right font-bold">العميل</TableHead>
                <TableHead className="text-right font-bold">التاريخ</TableHead>
                <TableHead className="text-right font-bold">المبلغ</TableHead>
                <TableHead className="text-right font-bold">حالة الدفع</TableHead>
                <TableHead className="text-right font-bold">آخر مزامنة</TableHead>
                <TableHead className="text-center font-bold w-32">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc, index) => {
                const details = getInvoiceDetails(doc);
                const invoice = details?.Invoice;
                
                return (
                  <TableRow 
                    key={doc.id}
                    className="hover:bg-muted/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="font-medium">
                      <Link 
                        to={`/documents/${doc.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {doc.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{doc.client_name}</p>
                        {invoice?.Client?.client_number && (
                          <p className="text-xs text-muted-foreground">{invoice.Client.client_number}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(doc.date)}</TableCell>
                    <TableCell className="font-bold">
                      {formatCurrency(
                        invoice?.summary_total || doc.total, 
                        invoice?.currency_code || doc.currency
                      )}
                    </TableCell>
                    <TableCell>{getPaymentStatusBadge(doc.payment_status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.synced_at ? formatDate(doc.synced_at) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {/* View Details Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => setSelectedInvoice(doc)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                تفاصيل الفاتورة - {doc.number}
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[70vh]">
                              {invoice ? (
                                <div className="space-y-6 p-4">
                                  {/* Client Info */}
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        معلومات العميل
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">اسم العميل</p>
                                        <p className="font-medium">{doc.client_name}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">رقم العميل</p>
                                        <p className="font-medium">{invoice.Client?.client_number || '-'}</p>
                                      </div>
                                      {invoice.Client?.email && (
                                        <div className="flex items-center gap-2">
                                          <Mail className="w-4 h-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm text-muted-foreground">البريد</p>
                                            <p className="text-sm">{invoice.Client.email}</p>
                                          </div>
                                        </div>
                                      )}
                                      {(invoice.Client?.phone1 || invoice.Client?.phone2) && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm text-muted-foreground">الهاتف</p>
                                            <p className="text-sm">{invoice.Client.phone1 || invoice.Client.phone2}</p>
                                          </div>
                                        </div>
                                      )}
                                      {invoice.Client?.address1 && (
                                        <div className="flex items-center gap-2 col-span-2">
                                          <MapPin className="w-4 h-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-sm text-muted-foreground">العنوان</p>
                                            <p className="text-sm">
                                              {[invoice.Client.address1, invoice.Client.city, invoice.Client.country_code]
                                                .filter(Boolean).join('، ')}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  {/* Invoice Details */}
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <Receipt className="w-4 h-4" />
                                        تفاصيل الفاتورة
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground">تاريخ الإصدار</p>
                                          <p className="font-medium flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(invoice.date)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">تاريخ الاستحقاق</p>
                                          <p className="font-medium">{formatDate(invoice.due_date)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">الإجمالي الفرعي</p>
                                          <p className="font-medium">
                                            {formatCurrency(invoice.summary_subtotal || 0, invoice.currency_code)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">الخصم</p>
                                          <p className="font-medium text-destructive">
                                            -{formatCurrency(invoice.summary_discount || 0, invoice.currency_code)}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="border-t pt-4 grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 rounded-lg bg-muted/50">
                                          <p className="text-sm text-muted-foreground">الإجمالي</p>
                                          <p className="font-bold text-lg">
                                            {formatCurrency(invoice.summary_total || 0, invoice.currency_code)}
                                          </p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-status-approved/10">
                                          <p className="text-sm text-muted-foreground">المدفوع</p>
                                          <p className="font-bold text-lg text-[hsl(var(--status-approved))]">
                                            {formatCurrency(invoice.summary_paid || 0, invoice.currency_code)}
                                          </p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-status-needsfix/10">
                                          <p className="text-sm text-muted-foreground">المتبقي</p>
                                          <p className="font-bold text-lg text-[hsl(var(--status-needsfix))]">
                                            {formatCurrency(invoice.summary_unpaid || 0, invoice.currency_code)}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Invoice Items */}
                                  {invoice.InvoiceItem && invoice.InvoiceItem.length > 0 && (
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base">بنود الفاتورة</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-right">الصنف</TableHead>
                                              <TableHead className="text-right">الوصف</TableHead>
                                              <TableHead className="text-center">الكمية</TableHead>
                                              <TableHead className="text-right">سعر الوحدة</TableHead>
                                              <TableHead className="text-right">الإجمالي</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {invoice.InvoiceItem.map((item, idx) => (
                                              <TableRow key={idx}>
                                                <TableCell className="font-medium">{item.product_name}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                  {item.description || '-'}
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell>
                                                  {formatCurrency(item.unit_price, invoice.currency_code)}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                  {formatCurrency(item.total_price, invoice.currency_code)}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Notes */}
                                  {invoice.html_notes && (
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base">ملاحظات</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div 
                                          className="prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: invoice.html_notes }}
                                        />
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    {invoice.invoice_pdf_url && (
                                      <Button asChild className="gap-2">
                                        <a href={invoice.invoice_pdf_url} target="_blank" rel="noopener noreferrer">
                                          <Download className="w-4 h-4" />
                                          تحميل PDF
                                        </a>
                                      </Button>
                                    )}
                                    {invoice.invoice_html_url && (
                                      <Button variant="outline" asChild className="gap-2">
                                        <a href={invoice.invoice_html_url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="w-4 h-4" />
                                          فتح في دفترة
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                  <p>لا تتوفر تفاصيل إضافية لهذه الفاتورة</p>
                                </div>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>

                        {/* External Links */}
                        {(invoice?.invoice_pdf_url || doc.pdf_url) && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            asChild
                          >
                            <a 
                              href={invoice?.invoice_pdf_url || doc.pdf_url || ''} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {(invoice?.invoice_html_url || doc.html_url) && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            asChild
                          >
                            <a 
                              href={invoice?.invoice_html_url || doc.html_url || ''} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && filteredDocuments.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            لا توجد فواتير
          </h3>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على فواتير مسحوبة من دفترة
          </p>
          <Button onClick={handleSync} disabled={isSyncing} className="gap-2">
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
            مزامنة الآن
          </Button>
        </div>
      )}
    </MainLayout>
  );
}
