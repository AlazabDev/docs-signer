-- Allow public insert to documents table for upload feature
CREATE POLICY "Allow public insert to documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (true);

-- Allow public insert to document_reviewers
CREATE POLICY "Allow public insert to document_reviewers" 
ON public.document_reviewers 
FOR INSERT 
WITH CHECK (true);