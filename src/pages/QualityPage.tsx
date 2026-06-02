import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchQuality } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Card } from '@/components/Card';
import { KPICard } from '@/components/KPICard';
import { StatusBarChart } from '@/components/StatusBarChart';
import { QueryState } from '@/components/QueryState';
import { formatNumber, formatPct } from '@/lib/format';

export function QualityPage() {
  const [sinceDays, setSinceDays] = useState(30);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quality', sinceDays],
    queryFn: () => fetchQuality(sinceDays),
  });

  return (
    <>
      <PageHeader
        title="Quality"
        description="Analysis reliability and AI-finding feedback."
        actions={<DateRangePicker value={sinceDays} onChange={setSinceDays} />}
      />

      <QueryState isLoading={isLoading} isError={isError} height={300}>
        {data && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                Analysis reliability
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <KPICard label="Total analyses" value={formatNumber(data.analysis.total)} />
                <KPICard label="Success rate" value={formatPct(data.analysis.successRate)} />
                <KPICard
                  label="Failure rate"
                  value={formatPct(data.analysis.failureRate)}
                  hint={data.analysis.failureRate > 0.1 ? 'Above 10% threshold' : undefined}
                />
              </div>
              <Card title="Analysis by status" className="mt-4">
                <StatusBarChart data={data.analysis.byStatus} />
              </Card>
            </section>

            <section>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                Finding feedback
              </h2>
              <Card title="Thumbs-up rate by surface">
                {data.feedback.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No feedback in this window.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-[0.08em] text-gray-400">
                          <th className="py-2 pr-4 font-semibold">Surface</th>
                          <th className="py-2 pr-4 font-semibold">Up</th>
                          <th className="py-2 pr-4 font-semibold">Down</th>
                          <th className="py-2 pr-4 font-semibold">Total</th>
                          <th className="py-2 font-semibold">Up rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.feedback.map((f) => (
                          <tr key={f.surface} className="border-b border-gray-100">
                            <td className="py-2 pr-4 font-semibold text-[#111827]">{f.surface}</td>
                            <td className="py-2 pr-4 text-[#15803d]">{f.up}</td>
                            <td className="py-2 pr-4 text-red-600">{f.down}</td>
                            <td className="py-2 pr-4 text-gray-500">{f.total}</td>
                            <td className="py-2 font-semibold text-[#111827]">
                              {formatPct(f.upRate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </section>
          </div>
        )}
      </QueryState>
    </>
  );
}
