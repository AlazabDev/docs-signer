-- Create project_images table to track images (without foreign key to projects since it uses TEXT id)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  folder_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  title TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Allow public access to project_images
CREATE POLICY "Public read project_images"
ON public.project_images FOR SELECT
USING (true);

CREATE POLICY "Public insert project_images"
ON public.project_images FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public update project_images"
ON public.project_images FOR UPDATE
USING (true);

CREATE POLICY "Public delete project_images"
ON public.project_images FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_project_images_updated_at
BEFORE UPDATE ON public.project_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();