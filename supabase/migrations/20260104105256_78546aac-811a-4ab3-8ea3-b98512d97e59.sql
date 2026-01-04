-- Allow public insert into documents table (for now, will add proper auth later)
DROP POLICY IF EXISTS "Anyone can insert documents" ON public.documents;
CREATE POLICY "Anyone can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (true);

-- Allow public insert into document_reviewers
DROP POLICY IF EXISTS "Anyone can insert document_reviewers" ON public.document_reviewers;
CREATE POLICY "Anyone can insert document_reviewers" 
ON public.document_reviewers 
FOR INSERT 
WITH CHECK (true);

-- Allow public read on documents
DROP POLICY IF EXISTS "Anyone can read documents" ON public.documents;
CREATE POLICY "Anyone can read documents" 
ON public.documents 
FOR SELECT 
USING (true);

-- Allow public read on document_reviewers
DROP POLICY IF EXISTS "Anyone can read document_reviewers" ON public.document_reviewers;
CREATE POLICY "Anyone can read document_reviewers" 
ON public.document_reviewers 
FOR SELECT 
USING (true);