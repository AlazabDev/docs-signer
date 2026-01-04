-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for documents bucket
CREATE POLICY "Public read access for documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');

-- Also ensure document_versions table has proper insert policy
DROP POLICY IF EXISTS "Allow insert document_versions" ON public.document_versions;
CREATE POLICY "Allow insert document_versions"
ON public.document_versions FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select document_versions" ON public.document_versions;
CREATE POLICY "Allow select document_versions"
ON public.document_versions FOR SELECT
TO public
USING (true);

-- Ensure document_audit_logs has proper policies
DROP POLICY IF EXISTS "Allow insert document_audit_logs" ON public.document_audit_logs;
CREATE POLICY "Allow insert document_audit_logs"
ON public.document_audit_logs FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select document_audit_logs" ON public.document_audit_logs;
CREATE POLICY "Allow select document_audit_logs"
ON public.document_audit_logs FOR SELECT
TO public
USING (true);

-- Ensure document_comments has proper policies
DROP POLICY IF EXISTS "Allow insert document_comments" ON public.document_comments;
CREATE POLICY "Allow insert document_comments"
ON public.document_comments FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select document_comments" ON public.document_comments;
CREATE POLICY "Allow select document_comments"
ON public.document_comments FOR SELECT
TO public
USING (true);

-- Ensure document_signatures has proper policies
DROP POLICY IF EXISTS "Allow insert document_signatures" ON public.document_signatures;
CREATE POLICY "Allow insert document_signatures"
ON public.document_signatures FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select document_signatures" ON public.document_signatures;
CREATE POLICY "Allow select document_signatures"
ON public.document_signatures FOR SELECT
TO public
USING (true);

-- Update policies on documents table
DROP POLICY IF EXISTS "Allow update documents" ON public.documents;
CREATE POLICY "Allow update documents"
ON public.documents FOR UPDATE
TO public
USING (true)
WITH CHECK (true);