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
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-card ${className ?? ''}`}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-[15px] font-extrabold tracking-tight text-[#111827]">{title}</h2>}
          {description && <p className="mt-0.5 text-[12px] text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
