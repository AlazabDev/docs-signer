import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, Upload, Trash2, Check } from 'lucide-react';

interface SignaturePanelProps {
  onSign: (signatureData: string) => void;
  disabled?: boolean;
}

export function SignaturePanel({ onSign, disabled = false }: SignaturePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Set drawing style
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.offsetWidth / rect.width;
    const scaleY = canvas.offsetHeight / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedSignature(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submitSignature = () => {
    let signatureData: string;

    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      signatureData = canvas.toDataURL('image/png');
    } else {
      if (!uploadedSignature) return;
      signatureData = uploadedSignature;
    }

    onSign(signatureData);
  };

  const canSubmit = activeTab === 'draw' ? hasSignature : !!uploadedSignature;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="w-5 h-5" />
          التوقيع الرقمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="draw">رسم التوقيع</TabsTrigger>
            <TabsTrigger value="upload">رفع صورة</TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className={`w-full h-40 border-2 border-dashed rounded-lg bg-white cursor-crosshair ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'border-border hover:border-primary/50'
                }`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                  ارسم توقيعك هنا
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={clearCanvas}
              disabled={!hasSignature || disabled}
            >
              <Trash2 className="w-4 h-4 ml-2" />
              مسح التوقيع
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>صورة التوقيع</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  uploadedSignature ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                {uploadedSignature ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedSignature}
                      alt="Uploaded signature"
                      className="max-h-24 mx-auto"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedSignature(null)}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      إزالة
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      اختر صورة توقيعك
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={disabled}
                      className="max-w-xs mx-auto"
                    />
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          className="w-full mt-4"
          onClick={submitSignature}
          disabled={!canSubmit || disabled}
        >
          <Check className="w-4 h-4 ml-2" />
          تأكيد التوقيع
        </Button>
      </CardContent>
    </Card>
  );
}
