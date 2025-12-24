import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  MessageSquarePlus, 
  Highlighter,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

interface Annotation {
  id: string;
  type: 'comment' | 'highlight';
  x: number;
  y: number;
  page: number;
  text: string;
  color?: string;
  createdAt: Date;
}

interface PDFViewerProps {
  fileUrl: string;
  documentId: string;
  onAddComment?: (comment: { x: number; y: number; page: number; text: string }) => void;
  existingAnnotations?: Annotation[];
  readOnly?: boolean;
}

export function PDFViewer({ 
  fileUrl, 
  documentId, 
  onAddComment, 
  existingAnnotations = [],
  readOnly = false 
}: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1); // Will be updated when we implement actual PDF parsing
  const [tool, setTool] = useState<'none' | 'comment' | 'highlight'>('none');
  const [annotations, setAnnotations] = useState<Annotation[]>(existingAnnotations);
  const [pendingComment, setPendingComment] = useState<{ x: number; y: number } | null>(null);
  const [commentText, setCommentText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || tool === 'none') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (tool === 'comment') {
      setPendingComment({ x, y });
    } else if (tool === 'highlight') {
      const newAnnotation: Annotation = {
        id: crypto.randomUUID(),
        type: 'highlight',
        x,
        y,
        page: currentPage,
        text: '',
        color: '#ffeb3b',
        createdAt: new Date(),
      };
      setAnnotations([...annotations, newAnnotation]);
    }
  }, [tool, currentPage, annotations, readOnly]);

  const submitComment = () => {
    if (!pendingComment || !commentText.trim()) return;

    const newAnnotation: Annotation = {
      id: crypto.randomUUID(),
      type: 'comment',
      x: pendingComment.x,
      y: pendingComment.y,
      page: currentPage,
      text: commentText,
      createdAt: new Date(),
    };

    setAnnotations([...annotations, newAnnotation]);
    onAddComment?.({
      x: pendingComment.x,
      y: pendingComment.y,
      page: currentPage,
      text: commentText,
    });

    setPendingComment(null);
    setCommentText('');
    setTool('none');
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <Button
              variant={tool === 'comment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool(tool === 'comment' ? 'none' : 'comment')}
            >
              <MessageSquarePlus className="w-4 h-4 ml-2" />
              تعليق
            </Button>
            <Button
              variant={tool === 'highlight' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool(tool === 'highlight' ? 'none' : 'highlight')}
            >
              <Highlighter className="w-4 h-4 ml-2" />
              تظليل
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/20 relative"
        onClick={handleContainerClick}
        style={{ cursor: tool !== 'none' ? 'crosshair' : 'default' }}
      >
        <div 
          className="relative mx-auto my-4 bg-background shadow-lg"
          style={{
            width: `${zoom}%`,
            maxWidth: '100%',
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* PDF iframe */}
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full aspect-[1/1.414] pointer-events-none"
            title="PDF Preview"
          />

          {/* Annotations Layer */}
          <div className="absolute inset-0 pointer-events-none">
            {annotations
              .filter((a) => a.page === currentPage)
              .map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {annotation.type === 'comment' ? (
                    <div className="relative group">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                        <MessageSquarePlus className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <Card className="absolute top-8 right-0 w-64 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">تعليق</Badge>
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => removeAnnotation(annotation.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm">{annotation.text}</p>
                      </Card>
                    </div>
                  ) : (
                    <div
                      className="w-8 h-4 rounded opacity-50 cursor-pointer"
                      style={{ backgroundColor: annotation.color }}
                      onClick={() => !readOnly && removeAnnotation(annotation.id)}
                    />
                  )}
                </div>
              ))}

            {/* Pending Comment Input */}
            {pendingComment && (
              <div
                className="absolute z-50 pointer-events-auto"
                style={{
                  left: `${pendingComment.x}%`,
                  top: `${pendingComment.y}%`,
                  transform: 'translate(-50%, 0)',
                }}
              >
                <Card className="w-72 p-3 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">إضافة تعليق</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setPendingComment(null);
                        setCommentText('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="اكتب تعليقك هنا..."
                    rows={3}
                    className="mb-2"
                    autoFocus
                  />
                  <Button size="sm" className="w-full" onClick={submitComment}>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Tool Hint */}
      {tool !== 'none' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm shadow-lg">
          {tool === 'comment' ? 'انقر على المستند لإضافة تعليق' : 'انقر لتظليل'}
        </div>
      )}
    </div>
  );
}
