import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentsTable } from '@/components/documents/DocumentsTable';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { useDocuments, Document as DBDocument } from '@/hooks/useDocuments';
import { STATUS_LABELS, DocumentStatus } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Transform DB document to UI document format
function transformDocument(doc: DBDocument) {
  return {
    id: doc.id,
    daftraId: doc.daftra_id || '',
    type: doc.type as 'invoice' | 'quote',
    number: doc.number,
    clientName: doc.client_name,
    clientEmail: doc.client_email || '',
    total: doc.total,
    currency: doc.currency,
    date: doc.date,
    status: doc.status as DocumentStatus,
    paymentStatus: doc.payment_status as 'paid' | 'partial' | 'unpaid',
    pdfUrl: doc.pdf_url || undefined,
    htmlUrl: doc.html_url || undefined,
    fileUrl: doc.file_url || undefined,
    syncedAt: doc.synced_at || undefined,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
}

export default function Documents() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') as DocumentStatus | null;
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(statusFilter || 'all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: documents = [], isLoading, refetch } = useDocuments(selectedStatus, debouncedSearch);

  const transformedDocuments = documents.map(transformDocument);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        `https://zrrffsjbfkphridqyais.supabase.co/functions/v1/sync-daftra`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (!response.ok) throw new Error('Sync failed');
      
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      toast.success('تمت المزامنة بنجاح');
    } catch (error) {
      toast.error('فشلت المزامنة');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <MainLayout 
      title="المستندات" 
      subtitle={`${transformedDocuments.length} مستند`}
    >
      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم المستند أو اسم العميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === 'table' && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === 'grid' && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          {/* Sync Button */}
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            مزامنة
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'table' ? (
        <DocumentsTable documents={transformedDocuments} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformedDocuments.map((doc, index) => (
            <DocumentCard key={doc.id} document={doc} delay={index * 50} />
          ))}
        </div>
      )}

      {!isLoading && transformedDocuments.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            لا توجد مستندات
          </h3>
          <p className="text-muted-foreground">
            لم يتم العثور على مستندات تطابق معايير البحث
          </p>
        </div>
      )}
    </MainLayout>
  );
}
