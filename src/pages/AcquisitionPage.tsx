import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAcquisitionFunnel } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Card } from '@/components/Card';
import { FunnelChart } from '@/components/FunnelChart';
import { TimeSeriesChart } from '@/components/TimeSeriesChart';
import { QueryState } from '@/components/QueryState';

export function AcquisitionPage() {
  const [sinceDays, setSinceDays] = useState(30);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['acquisition', sinceDays],
    queryFn: () => fetchAcquisitionFunnel(sinceDays),
  });

  return (
    <>
      <PageHeader
        title="Acquisition"
        description="Signup → activation funnel and daily signups."
        actions={<DateRangePicker value={sinceDays} onChange={setSinceDays} />}
      />

      <QueryState isLoading={isLoading} isError={isError} height={300}>
        {data && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Activation funnel" description={`Last ${data.sinceDays} days`}>
              <FunnelChart stages={data.funnel} />
            </Card>
            <Card title="Daily signups" description={`Last ${data.sinceDays} days`}>
              <TimeSeriesChart data={data.signupSeries} label="Signups" />
            </Card>
          </div>
        )}
      </QueryState>
    </>
  );
}
