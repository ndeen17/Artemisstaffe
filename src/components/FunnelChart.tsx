interface FunnelStage {
  stage: string;
  count: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  labels?: Record<string, string>;
}

const DEFAULT_LABELS: Record<string, string> = {
  signed_up: 'Signed up',
  email_verified: 'Email verified',
  onboarding_complete: 'Onboarding complete',
  first_analysis: 'First analysis',
};

export function FunnelChart({ stages, labels }: FunnelChartProps) {
  const top = stages[0]?.count ?? 0;
  const labelMap = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const pctOfTop = top > 0 ? (s.count / top) * 100 : 0;
        const prev = i > 0 ? stages[i - 1].count : null;
        const conversion = prev && prev > 0 ? (s.count / prev) * 100 : null;
        return (
          <div key={s.stage}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#111827]">{labelMap[s.stage] ?? s.stage}</span>
              <span className="text-gray-500">
                <span className="font-semibold text-[#111827]">{s.count.toLocaleString()}</span>
                {conversion !== null && (
                  <span className="ml-2 text-xs text-gray-400">
                    {conversion.toFixed(1)}% from prev
                  </span>
                )}
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-full bg-[#fafafa]">
              <div
                className="flex h-full items-center justify-end rounded-full bg-[#15803d] px-3 text-xs font-semibold text-white transition-all"
                style={{ width: `${Math.max(pctOfTop, 2)}%` }}
              >
                {pctOfTop >= 12 ? `${pctOfTop.toFixed(0)}%` : ''}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
