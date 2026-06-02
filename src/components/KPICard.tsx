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
        'rounded-2xl border border-gray-100 bg-white p-5 shadow-card',
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-[#111827]">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold',
              trend.positive === false ? 'text-red-600' : 'text-[#15803d]',
            )}
          >
            {trend.positive === false ? '▼' : '▲'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[12px] text-gray-500">{hint}</p>}
    </div>
  );
}
