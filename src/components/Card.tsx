import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-brand-border bg-white p-5 shadow-sm ${className ?? ''}`}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>}
          {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
