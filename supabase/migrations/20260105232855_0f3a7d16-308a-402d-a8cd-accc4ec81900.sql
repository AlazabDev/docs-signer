-- Delete corrupted documents with null daftra_id or invalid data
DELETE FROM documents 
WHERE daftra_id IS NULL 
   OR number LIKE 'INVOICE-undefined%'
   OR (client_name = 'غير محدد' AND total = 0);

-- Add unique constraint on daftra_id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'documents_daftra_id_key'
  ) THEN
    ALTER TABLE documents ADD CONSTRAINT documents_daftra_id_key UNIQUE (daftra_id);
  END IF;
END $$;