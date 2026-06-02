import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface StatusBarChartProps {
  data: Record<string, number>;
  height?: number;
  colors?: Record<string, string>;
}

const DEFAULT_COLOR = '#15803d';
const STATUS_COLORS: Record<string, string> = {
  done: '#15803d',
  completed: '#15803d',
  offer: '#15803d',
  failed: '#dc2626',
  rejected: '#dc2626',
  abandoned: '#dc2626',
  interrupted: '#dc2626',
  running: '#2563eb',
  live: '#2563eb',
  queued: '#9CA3AF',
  saved: '#9CA3AF',
};

export function StatusBarChart({ data, height = 240, colors }: StatusBarChartProps) {
  const rows = Object.entries(data).map(([status, count]) => ({ status, count }));
  const colorMap = { ...STATUS_COLORS, ...colors };

  if (rows.every((r) => r.count === 0)) {
    return (
      <div
        className="flex items-center justify-center text-sm text-ink-subtle"
        style={{ height }}
      >
        No data in this window.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: '#F8FAFC' }}
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {rows.map((r) => (
            <Cell key={r.status} fill={colorMap[r.status] ?? DEFAULT_COLOR} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
