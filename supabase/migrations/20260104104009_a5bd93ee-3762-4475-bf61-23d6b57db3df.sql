-- Add magicplan_gallery_url to documents table for project gallery links
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS magicplan_gallery_url TEXT;

-- Update a sample document with the MagicPlan gallery URL
UPDATE public.documents 
SET magicplan_gallery_url = 'https://cloud.magicplan.app/estimator/photo-export/5ddc1070-40d0-4f74-b66e-1c4737428203'
WHERE number = 'AZ-INV-2025-0142';

-- Add comment
COMMENT ON COLUMN public.documents.magicplan_gallery_url IS 'MagicPlan photo gallery URL for the project';