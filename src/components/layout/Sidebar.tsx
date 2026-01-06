import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Settings, 
  Users, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Clock,
  AlertCircle,
  Upload,
  Image,
  Receipt,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  highlight?: boolean;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/' },
  { icon: FileText, label: 'المستندات', href: '/documents' },
  { icon: Receipt, label: 'عروض الأسعار', href: '/quotes', highlight: true },
  { icon: Receipt, label: 'فواتير دفترة', href: '/daftra-invoices' },
  { icon: Upload, label: 'رفع مستند', href: '/upload' },
  { icon: Image, label: 'معرض الصور', href: '/gallery' },
  { icon: Clock, label: 'قيد المراجعة', href: '/documents?status=in_review', badge: 3 },
  { icon: FileCheck, label: 'المعتمدة', href: '/documents?status=approved' },
];

const settingsNavItems: NavItem[] = [
  { icon: ClipboardList, label: 'تقرير النظام', href: '/system-report' },
  { icon: Users, label: 'المستخدمين', href: '/users' },
  { icon: RefreshCw, label: 'المزامنة', href: '/sync' },
  { icon: Settings, label: 'الإعدادات', href: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  return (
    <aside 
      className={cn(
        "fixed right-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">نظام الاعتماد</h1>
              <p className="text-xs text-sidebar-foreground/60">إدارة المستندات</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-accent flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-accent-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : item.highlight
                    ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", collapsed && "mx-auto")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sidebar-foreground/20">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -left-1 w-5 h-5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          {!collapsed && (
            <p className="px-3 text-xs font-medium text-sidebar-foreground/50 mb-2">الإدارة</p>
          )}
          <div className="space-y-1">
            {settingsNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", collapsed && "mx-auto")} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Sync Status */}
      <div className={cn("p-4 border-t border-sidebar-border", collapsed && "text-center")}>
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="w-2 h-2 rounded-full bg-status-approved animate-pulse" />
          {!collapsed && (
            <span className="text-xs text-sidebar-foreground/60">
              آخر مزامنة: منذ 5 دقائق
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
