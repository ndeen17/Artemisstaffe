import type { ReactNode } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
  height?: number;
}

export function QueryState({ isLoading, isError, children, height = 200 }: QueryStateProps) {
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center gap-2 text-sm text-ink-muted"
        style={{ minHeight: height }}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }
  if (isError) {
    return (
      <div
        className="flex items-center justify-center gap-2 text-sm text-red-600"
        style={{ minHeight: height }}
      >
        <AlertTriangle className="h-4 w-4" />
        Failed to load data.
      </div>
    );
  }
  return <>{children}</>;
}
