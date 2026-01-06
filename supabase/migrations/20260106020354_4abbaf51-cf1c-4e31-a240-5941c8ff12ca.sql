-- Make the documents bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'documents';

-- If bucket doesn't exist, create it as public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'])
ON CONFLICT (id) DO UPDATE SET public = true;