-- Create documents table for synced Daftra data
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  daftra_id TEXT UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('invoice', 'quote', 'estimate')),
  number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EGP',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'needs_fix', 'ready_to_approve', 'approved', 'signed', 'archived')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'partial', 'unpaid')),
  pdf_url TEXT,
  html_url TEXT,
  raw_json JSONB,
  synced_at TIMESTAMP WITH TIME ZONE,
  assigned_reviewer_id UUID REFERENCES auth.users(id),
  assigned_approver_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document versions table
CREATE TABLE public.document_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  source TEXT NOT NULL CHECK (source IN ('daftra', 'upload')),
  file_url TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document comments table
CREATE TABLE public.document_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  page INTEGER,
  x_position NUMERIC,
  y_position NUMERIC,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document signatures table
CREATE TABLE public.document_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  signer_id UUID REFERENCES auth.users(id),
  signer_name TEXT NOT NULL,
  signature_data TEXT NOT NULL,
  signed_pdf_url TEXT,
  pdf_hash TEXT,
  ip_address TEXT,
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document audit logs table
CREATE TABLE public.document_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_type ON public.documents(type);
CREATE INDEX idx_documents_daftra_id ON public.documents(daftra_id);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX idx_document_comments_document_id ON public.document_comments(document_id);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_audit_logs_document_id ON public.document_audit_logs(document_id);

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Staff can view all documents"
  ON public.documents FOR SELECT
  USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert documents"
  ON public.documents FOR INSERT
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update documents"
  ON public.documents FOR UPDATE
  USING (is_staff(auth.uid()));

CREATE POLICY "Admins can delete documents"
  ON public.documents FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for document_versions
CREATE POLICY "Staff can view document versions"
  ON public.document_versions FOR SELECT
  USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert document versions"
  ON public.document_versions FOR INSERT
  WITH CHECK (is_staff(auth.uid()));

-- RLS Policies for document_comments
CREATE POLICY "Staff can view comments"
  ON public.document_comments FOR SELECT
  USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert comments"
  ON public.document_comments FOR INSERT
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Users can update own comments"
  ON public.document_comments FOR UPDATE
  USING (user_id = auth.uid() OR is_staff(auth.uid()));

-- RLS Policies for document_signatures
CREATE POLICY "Staff can view signatures"
  ON public.document_signatures FOR SELECT
  USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert signatures"
  ON public.document_signatures FOR INSERT
  WITH CHECK (is_staff(auth.uid()));

-- RLS Policies for document_audit_logs
CREATE POLICY "Staff can view audit logs"
  ON public.document_audit_logs FOR SELECT
  USING (is_staff(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON public.document_audit_logs FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_documents_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for documents updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_documents_updated_at();

-- Trigger for comments updated_at
CREATE TRIGGER update_document_comments_updated_at
  BEFORE UPDATE ON public.document_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_documents_updated_at();

-- Function to log document status changes
CREATE OR REPLACE FUNCTION public.log_document_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.document_audit_logs (
      document_id,
      actor_id,
      actor_name,
      action,
      old_value,
      new_value
    ) VALUES (
      NEW.id,
      auth.uid(),
      COALESCE((SELECT name FROM profiles WHERE id = auth.uid()), 'System'),
      'status_change',
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for logging status changes
CREATE TRIGGER log_document_status_change
  AFTER UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.log_document_status_change();