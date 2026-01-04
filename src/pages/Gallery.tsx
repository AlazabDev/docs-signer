import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  Download, 
  Trash2, 
  ZoomIn, 
  FolderOpen, 
  Image as ImageIcon,
  Grid,
  List,
  Search,
  Loader2,
  Plus,
  ExternalLink,
  Link2
} from 'lucide-react';

interface ProjectImage {
  id: string;
  project_id: string | null;
  document_id: string | null;
  folder_name: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  title: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

const PROJECT_FOLDERS = [
  { id: 'Tanta-Stadium', name: 'طنطا - الاستاد' },
  { id: 'Banha-Villas', name: 'بنها - الفيلات' },
  { id: 'Mansoura-Almashay', name: 'المنصورة - المشاية' },
  { id: 'Mansoura-Altirea', name: 'المنصورة - التريعة' },
  { id: 'Alex-Luran', name: 'الإسكندرية - لوران' },
  { id: 'Hurghada-Maintenance', name: 'الغردقة - صيانة' },
  { id: 'Avenue-Almaza', name: 'القاهرة - المعز' },
  { id: 'Faisal-Alharam', name: 'الجيزة - الهرم' },
  { id: 'Tanta-Maintenance', name: 'طنطا - صيانة' },
];

interface DocumentWithGallery {
  id: string;
  number: string;
  client_name: string;
  magicplan_gallery_url: string | null;
}

export default function Gallery() {
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch documents with MagicPlan gallery URLs
  const { data: documentsWithGallery = [] } = useQuery({
    queryKey: ['documents-with-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('id, number, client_name, magicplan_gallery_url')
        .not('magicplan_gallery_url', 'is', null);
      
      if (error) throw error;
      return data as DocumentWithGallery[];
    },
  });

  // Fetch images from database
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['project-images', selectedFolder, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('project_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedFolder && selectedFolder !== 'all') {
        query = query.eq('folder_name', selectedFolder);
      }

      if (searchQuery) {
        query = query.or(`file_name.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProjectImage[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (image: ProjectImage) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('projects')
        .remove([image.file_path]);
      
      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-images'] });
      toast.success('تم حذف الصورة بنجاح');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('فشل في حذف الصورة');
    },
  });

  // Handle file upload
  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!uploadFolder) {
      toast.error('يرجى اختيار مجلد المشروع');
      return;
    }

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${uploadFolder}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase
          .from('project_images')
          .insert({
            folder_name: uploadFolder,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            title: file.name.replace(/\.[^/.]+$/, ''),
          });

        if (dbError) throw dbError;
      }

      queryClient.invalidateQueries({ queryKey: ['project-images'] });
      toast.success(`تم رفع ${files.length} صورة بنجاح`);
      setUploadDialogOpen(false);
      setUploadFolder('');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل في رفع الصور');
    } finally {
      setUploading(false);
    }
  }, [uploadFolder, queryClient]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  // Get image URL
  const getImageUrl = (image: ProjectImage) => {
    const { data } = supabase.storage.from('projects').getPublicUrl(image.file_path);
    return data.publicUrl;
  };

  // Download image
  const downloadImage = async (image: ProjectImage) => {
    const { data, error } = await supabase.storage
      .from('projects')
      .download(image.file_path);

    if (error) {
      toast.error('فشل في تحميل الصورة');
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = image.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get folder stats
  const folderStats = images.reduce((acc, img) => {
    acc[img.folder_name] = (acc[img.folder_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout title="معرض الصور" subtitle="عرض وإدارة صور المشاريع">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث في الصور..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="جميع المشاريع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المشاريع</SelectItem>
                {PROJECT_FOLDERS.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name} ({folderStats[folder.id] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="ml-2 h-4 w-4" />
              رفع صور
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الصور</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <FolderOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المجلدات النشطة</p>
                <p className="text-2xl font-bold">{Object.keys(folderStats).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-amber-500/10 p-3">
                <Link2 className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">معارض MagicPlan</p>
                <p className="text-2xl font-bold">{documentsWithGallery.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MagicPlan Galleries */}
        {documentsWithGallery.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              معارض MagicPlan المرتبطة
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documentsWithGallery.map((doc) => (
                <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doc.number}</p>
                        <p className="text-sm text-muted-foreground">{doc.client_name}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.magicplan_gallery_url!, '_blank')}
                      >
                        <ExternalLink className="ml-2 h-4 w-4" />
                        فتح المعرض
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <Card className="flex h-64 flex-col items-center justify-center gap-4">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">لا توجد صور</p>
            <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
              <Plus className="ml-2 h-4 w-4" />
              رفع صور جديدة
            </Button>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <Card key={image.id} className="group overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={getImageUrl(image)}
                    alt={image.title || image.file_name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-full items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setSelectedImage(image)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="truncate text-sm font-medium">
                    {image.title || image.file_name}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {PROJECT_FOLDERS.find(f => f.id === image.folder_name)?.name || image.folder_name}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {images.map((image) => (
              <Card key={image.id} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(image)}
                    alt={image.title || image.file_name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{image.title || image.file_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {PROJECT_FOLDERS.find(f => f.id === image.folder_name)?.name || image.folder_name}
                      </Badge>
                      <span>
                        {image.file_size ? `${(image.file_size / 1024).toFixed(1)} KB` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setSelectedImage(image)}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => downloadImage(image)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>رفع صور جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مجلد المشروع" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_FOLDERS.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      اسحب الصور هنا أو اضغط للاختيار
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      PNG, JPG, GIF, WebP - حتى 50MB
                    </p>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            {selectedImage && (
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 top-2 z-10"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img
                  src={getImageUrl(selectedImage)}
                  alt={selectedImage.title || selectedImage.file_name}
                  className="max-h-[80vh] w-full object-contain"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {selectedImage.title || selectedImage.file_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {PROJECT_FOLDERS.find(f => f.id === selectedImage.folder_name)?.name}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
