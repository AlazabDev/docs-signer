-- جدول عناصر عروض الأسعار المسحوبة من دفترة
CREATE TABLE public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  daftra_item_id TEXT,
  product_name TEXT NOT NULL,
  product_description TEXT,
  quantity NUMERIC DEFAULT 1,
  unit_price NUMERIC DEFAULT 0,
  total_price NUMERIC DEFAULT 0,
  notes TEXT,
  -- حالة الاعتماد من العميل
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  -- تتبع
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة للجميع (العميل يحتاج رؤية عناصره)
CREATE POLICY "Anyone can view quote items" 
ON public.quote_items 
FOR SELECT 
USING (true);

-- سياسة التحديث (للموافقة/الرفض)
CREATE POLICY "Anyone can update quote item approval" 
ON public.quote_items 
FOR UPDATE 
USING (true);

-- فهرس للبحث السريع
CREATE INDEX idx_quote_items_document_id ON public.quote_items(document_id);
CREATE INDEX idx_quote_items_approval_status ON public.quote_items(approval_status);

-- Trigger لتحديث updated_at
CREATE TRIGGER update_quote_items_updated_at
BEFORE UPDATE ON public.quote_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();