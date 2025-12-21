import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: 'شركة العذاب للتجهيزات',
    companyEmail: 'info@alazab.com',
    companyPhone: '+20 123 456 789',
    emailNotifications: true,
    smsNotifications: false,
    autoSync: true,
    syncInterval: '30',
    daftraApiKey: '',
    daftraSubdomain: '',
    language: 'ar',
    timezone: 'Africa/Cairo',
    theme: 'light'
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      });
    } catch {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout title="الإعدادات" subtitle="إدارة إعدادات النظام">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">عام</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">التكامل</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">المظهر</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                الإعدادات العامة
              </CardTitle>
              <CardDescription>
                إعدادات الشركة والمعلومات الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">اسم الشركة</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">البريد الإلكتروني</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">رقم الهاتف</Label>
                  <Input
                    id="companyPhone"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                تحكم في كيفية تلقي الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label>إشعارات البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">
                    استلام إشعارات عبر البريد الإلكتروني
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label>إشعارات SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    استلام إشعارات عبر الرسائل النصية
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                تكامل دفترة
              </CardTitle>
              <CardDescription>
                إعدادات الربط مع نظام دفترة للفواتير
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label>المزامنة التلقائية</Label>
                  <p className="text-sm text-muted-foreground">
                    مزامنة المستندات تلقائياً من دفترة
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSync: checked })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="daftraSubdomain">Daftra Subdomain</Label>
                  <Input
                    id="daftraSubdomain"
                    placeholder="your-company"
                    value={settings.daftraSubdomain}
                    onChange={(e) => setSettings({ ...settings, daftraSubdomain: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">فترة المزامنة (دقيقة)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={settings.syncInterval}
                    onChange={(e) => setSettings({ ...settings, syncInterval: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="daftraApiKey">API Key</Label>
                <Input
                  id="daftraApiKey"
                  type="password"
                  placeholder="أدخل مفتاح API"
                  value={settings.daftraApiKey}
                  onChange={(e) => setSettings({ ...settings, daftraApiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  يمكنك الحصول على مفتاح API من لوحة تحكم دفترة
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                DeepSeek AI
              </CardTitle>
              <CardDescription>
                إعدادات المساعد الذكي لتحليل المستندات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-status-approved/10 border border-status-approved/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-status-approved animate-pulse" />
                  <span className="text-sm font-medium text-[hsl(var(--status-approved))]">
                    متصل ويعمل بشكل طبيعي
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                المظهر
              </CardTitle>
              <CardDescription>
                تخصيص مظهر التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'light' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="w-full h-20 rounded bg-gradient-to-b from-white to-gray-100 mb-2" />
                  <span className="text-sm font-medium">فاتح</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="w-full h-20 rounded bg-gradient-to-b from-gray-800 to-gray-900 mb-2" />
                  <span className="text-sm font-medium">داكن</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'system' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'system' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="w-full h-20 rounded bg-gradient-to-r from-white via-gray-400 to-gray-800 mb-2" />
                  <span className="text-sm font-medium">تلقائي</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          إعادة تعيين
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </MainLayout>
  );
}
