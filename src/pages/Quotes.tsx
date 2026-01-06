import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useDocuments } from "@/hooks/useDocuments";
import { toast } from "sonner";
import { 
  Search, 
  RefreshCw, 
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Eye
} from "lucide-react";

export default function Quotes() {
  const navigate = useNavigate();
  const { data: documents = [], isLoading, refetch } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Filter only quotes
  const quotes = documents.filter(doc => doc.type === 'quote');
  
  const filteredQuotes = quotes.filter(quote =>
    quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await supabase.functions.invoke('sync-daftra', {
        body: { type: 'quotes', limit: 100 }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      if (data.success) {
        toast.success(`تم مزامنة ${data.synced} عرض سعر و ${data.itemsSynced} عنصر`);
        refetch();
      } else {
        throw new Error(data.error || 'فشل في المزامنة');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في المزامنة');
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "EGP") => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <MainLayout title="عروض الأسعار" subtitle="إدارة ومراجعة عروض الأسعار">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">عروض الأسعار</h1>
            <p className="text-muted-foreground mt-1">
              إدارة ومراجعة عروض الأسعار المسحوبة من دفترة
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSync} 
              disabled={syncing}
              className="bg-primary hover:bg-primary/90"
            >
              {syncing ? (
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 ml-2" />
              )}
              مزامنة من دفترة
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="بحث برقم العرض أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{quotes.length}</p>
              <p className="text-sm text-muted-foreground">إجمالي العروض</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">
                {quotes.filter(q => q.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">في الانتظار</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">
                {quotes.filter(q => q.status === 'approved').length}
              </p>
              <p className="text-sm text-muted-foreground">معتمد</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold">
                {quotes.filter(q => q.status === 'rejected').length}
              </p>
              <p className="text-sm text-muted-foreground">مرفوض</p>
            </CardContent>
          </Card>
        </div>

        {/* Quotes List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">لا توجد عروض أسعار</h3>
              <p className="text-muted-foreground mb-4">
                اضغط على "مزامنة من دفترة" لسحب عروض الأسعار
              </p>
              <Button onClick={handleSync} disabled={syncing}>
                <RefreshCw className="w-4 h-4 ml-2" />
                مزامنة الآن
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-foreground">{quote.number}</h3>
                        <Badge variant="outline" className="text-xs">
                          {quote.type === 'quote' ? 'عرض سعر' : quote.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{quote.client_name}</p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{formatDate(quote.date)}</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(quote.total, quote.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {quote.html_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={quote.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/quote-review/${quote.id}`)}
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        مراجعة العناصر
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
