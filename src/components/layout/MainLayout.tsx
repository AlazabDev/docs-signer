import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SEO } from '@/components/SEO';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title={`${title} | نظام اعتماد المستندات`}
        description={subtitle || 'نظام متكامل لإدارة ومراجعة واعتماد المستندات والفواتير وعروض الأسعار مع التكامل مع دفترة.'}
      />
      <Sidebar />
      <main className={cn("mr-64 min-h-screen transition-all duration-300")}>
        <Header title={title} subtitle={subtitle} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
