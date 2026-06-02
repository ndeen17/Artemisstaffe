import { cn } from '@/lib/cn';

export const RANGE_OPTIONS = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '1y', value: 365 },
] as const;

interface DateRangePickerProps {
  value: number;
  onChange: (days: number) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="inline-flex rounded-full border border-gray-100 bg-white p-1 shadow-card">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
            value === opt.value
              ? 'bg-[#dcfce7] text-[#15803d]'
              : 'text-gray-500 hover:text-[#111827]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
