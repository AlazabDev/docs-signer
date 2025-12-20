import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DocumentsTable } from '@/components/documents/DocumentsTable';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { mockDocuments } from '@/data/mockDocuments';
import { DocumentStatus, STATUS_LABELS } from '@/types/document';
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
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Documents() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') as DocumentStatus | null;
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(statusFilter || 'all');

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = 
      doc.number.toLowerCase().includes(search.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout 
      title="المستندات" 
      subtitle={`${filteredDocuments.length} مستند`}
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
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            مزامنة
          </Button>
        </div>
      </div>

      {/* Documents */}
      {viewMode === 'table' ? (
        <DocumentsTable documents={filteredDocuments} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc, index) => (
            <DocumentCard key={doc.id} document={doc} delay={index * 50} />
          ))}
        </div>
      )}

      {filteredDocuments.length === 0 && (
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
