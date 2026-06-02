import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOverview } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { DateRangePicker } from '@/components/DateRangePicker';
import { KPICard } from '@/components/KPICard';
import { QueryState } from '@/components/QueryState';
import { formatNumber, formatPct } from '@/lib/format';

export function OverviewPage() {
  const [sinceDays, setSinceDays] = useState(30);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['overview', sinceDays],
    queryFn: () => fetchOverview(sinceDays),
  });

  return (
    <>
      <PageHeader
        title="Overview"
        description="Top-line growth and product health at a glance."
        actions={<DateRangePicker value={sinceDays} onChange={setSinceDays} />}
      />

      <QueryState isLoading={isLoading} isError={isError} height={300}>
        {data && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Users
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                <KPICard label="Total users" value={formatNumber(data.users.total)} />
                <KPICard
                  label={`New (${data.sinceDays}d)`}
                  value={formatNumber(data.users.new)}
                />
                <KPICard
                  label={`Active (${data.sinceDays}d)`}
                  value={formatNumber(data.users.active)}
                />
                <KPICard
                  label="Verified"
                  value={formatNumber(data.users.verified)}
                  hint={`${formatPct(data.users.verifiedPct)} of all users`}
                />
                <KPICard
                  label="Onboarded"
                  value={formatNumber(data.users.onboarded)}
                  hint={`${formatPct(data.users.onboardedPct)} of all users`}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Content
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KPICard label="CVs" value={formatNumber(data.content.cvs)} />
                <KPICard label="Analyses" value={formatNumber(data.content.analyses)} />
                <KPICard label="Applications" value={formatNumber(data.content.applications)} />
                <KPICard label="Interviews" value={formatNumber(data.content.interviews)} />
              </div>
            </section>
          </div>
        )}
      </QueryState>
    </>
  );
}
