import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductFunnel, type ProductFunnelType } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Card } from '@/components/Card';
import { KPICard } from '@/components/KPICard';
import { StatusBarChart } from '@/components/StatusBarChart';
import { QueryState } from '@/components/QueryState';
import { formatNumber, formatPct } from '@/lib/format';
import { cn } from '@/lib/cn';

const TYPES: { value: ProductFunnelType; label: string }[] = [
  { value: 'cv', label: 'CV Analysis' },
  { value: 'interview', label: 'Interviews' },
  { value: 'application', label: 'Applications' },
];

export function ProductPage() {
  const [type, setType] = useState<ProductFunnelType>('cv');
  const [sinceDays, setSinceDays] = useState(30);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', type, sinceDays],
    queryFn: () => fetchProductFunnel(type, sinceDays),
  });

  return (
    <>
      <PageHeader
        title="Product"
        description="Status distribution and conversion for core flows."
        actions={<DateRangePicker value={sinceDays} onChange={setSinceDays} />}
      />

      <div className="mb-6 inline-flex rounded-full border border-gray-100 bg-white p-1 shadow-card">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              type === t.value
                ? 'bg-[#dcfce7] text-[#15803d]'
                : 'text-gray-500 hover:text-[#111827]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <QueryState isLoading={isLoading} isError={isError} height={300}>
        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <KPICard label="Total" value={formatNumber(data.total)} />
              {data.type === 'cv' && (
                <KPICard label="Success rate" value={formatPct(data.successRate)} />
              )}
              {data.type === 'interview' && (
                <>
                  <KPICard label="Completion rate" value={formatPct(data.completionRate)} />
                  <KPICard label="Text" value={formatNumber(data.byMode.text ?? 0)} />
                  <KPICard label="Voice" value={formatNumber(data.byMode.voice ?? 0)} />
                </>
              )}
              {data.type === 'application' && (
                <KPICard
                  label="Positive outcome"
                  value={formatPct(data.positiveOutcomeRate)}
                  hint="interview + offer"
                />
              )}
            </div>

            <Card title="By status" description={`Last ${data.sinceDays} days`}>
              <StatusBarChart data={data.byStatus} />
            </Card>

            {data.type === 'interview' && Object.keys(data.byEndedReason).length > 0 && (
              <Card title="Ended reason">
                <StatusBarChart data={data.byEndedReason} height={200} />
              </Card>
            )}
          </div>
        )}
      </QueryState>
    </>
  );
}
