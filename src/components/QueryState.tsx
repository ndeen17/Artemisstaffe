import type { ReactNode } from 'react';
import { SpinnerIcon, AlertIcon } from '@/components/icons';

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
        className="flex items-center justify-center gap-2 text-sm text-gray-500"
        style={{ minHeight: height }}
      >
        <SpinnerIcon className="h-4 w-4" />
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
        <AlertIcon className="h-4 w-4" />
        Failed to load data.
      </div>
    );
  }
  return <>{children}</>;
}
