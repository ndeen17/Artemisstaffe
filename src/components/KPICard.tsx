import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface KPICardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  trend?: { value: number; positive?: boolean };
  className?: string;
}

export function KPICard({ label, value, hint, trend, className }: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-brand-border bg-white p-5 shadow-sm',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-brand-navy">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold',
              trend.positive === false ? 'text-red-600' : 'text-brand-greenInk',
            )}
          >
            {trend.positive === false ? '▼' : '▲'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
