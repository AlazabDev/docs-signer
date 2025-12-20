import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  delay?: number;
}

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'bg-gradient-primary text-primary-foreground',
  success: 'bg-status-approved/10 border border-status-approved/20',
  warning: 'bg-status-review/10 border border-status-review/20',
  danger: 'bg-status-needsfix/10 border border-status-needsfix/20',
};

const iconContainerStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-status-approved/20 text-status-approved',
  warning: 'bg-status-review/20 text-status-review',
  danger: 'bg-status-needsfix/20 text-status-needsfix',
};

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  variant = 'default',
  className,
  delay = 0
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "metric-card animate-slide-up",
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold",
            variant === 'primary' ? 'text-primary-foreground' : 'text-foreground'
          )}>
            {value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm",
              trend.isPositive ? 'text-status-approved' : 'text-status-needsfix'
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.value}%</span>
              <span className={cn(
                "text-xs",
                variant === 'primary' ? 'text-primary-foreground/60' : 'text-muted-foreground'
              )}>
                من الأسبوع الماضي
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconContainerStyles[variant]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
