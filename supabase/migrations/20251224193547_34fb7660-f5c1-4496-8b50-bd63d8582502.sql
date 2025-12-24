-- Create document_reviewers table for tracking reviewers
CREATE TABLE IF NOT EXISTS public.document_reviewers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('engineering', 'procurement', 'accounting')),
  access_hash TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add columns to documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS sender_name TEXT,
ADD COLUMN IF NOT EXISTS project_id TEXT;

-- Enable RLS
ALTER TABLE public.document_reviewers ENABLE ROW LEVEL SECURITY;

-- Allow public access for reviewers via hash
CREATE POLICY "Anyone can view reviewers by hash" 
ON public.document_reviewers 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update reviewer status by hash" 
ON public.document_reviewers 
FOR UPDATE 
USING (true);

-- Create index for faster hash lookups
CREATE INDEX IF NOT EXISTS idx_document_reviewers_hash ON public.document_reviewers(access_hash);
CREATE INDEX IF NOT EXISTS idx_document_reviewers_document ON public.document_reviewers(document_id);

-- Trigger for updated_at
CREATE TRIGGER update_document_reviewers_updated_at
BEFORE UPDATE ON public.document_reviewers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();