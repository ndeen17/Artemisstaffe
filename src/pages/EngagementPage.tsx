import { useQuery } from '@tanstack/react-query';
import { fetchEngagement } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { KPICard } from '@/components/KPICard';
import { Card } from '@/components/Card';
import { QueryState } from '@/components/QueryState';
import { formatNumber, formatPct } from '@/lib/format';

export function EngagementPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['engagement'],
    queryFn: fetchEngagement,
  });

  return (
    <>
      <PageHeader
        title="Engagement"
        description="Active users and voice-mode adoption."
      />

      <QueryState isLoading={isLoading} isError={isError} height={300}>
        {data && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                Active users
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KPICard label="DAU" value={formatNumber(data.activeUsers.dau)} hint="Last 24h" />
                <KPICard label="WAU" value={formatNumber(data.activeUsers.wau)} hint="Last 7d" />
                <KPICard label="MAU" value={formatNumber(data.activeUsers.mau)} hint="Last 30d" />
                <KPICard
                  label="Stickiness"
                  value={formatPct(data.stickiness)}
                  hint="DAU / MAU"
                />
              </div>
            </section>

            <Card title="Voice mode" description={`Last ${data.voice.windowDays} days`}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KPICard
                  label="Active voice users"
                  value={formatNumber(data.voice.activeUsers)}
                />
                <KPICard
                  label="Total minutes"
                  value={formatNumber(data.voice.totalMinutes)}
                />
                <KPICard
                  label="Avg min / user"
                  value={data.voice.avgMinutesPerUser.toFixed(1)}
                />
              </div>
            </Card>
          </div>
        )}
      </QueryState>
    </>
  );
}
