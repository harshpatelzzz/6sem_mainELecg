import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Area, AreaChart } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border border-[var(--border)] shadow-lg backdrop-blur-md">
        <p className="text-mono text-xs text-[var(--text-secondary)] mb-1">Time: {payload[0].payload.timestamp}</p>
        <p className="text-display font-bold text-[var(--cyan)]">Score: {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function RiskTrajectoryChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center rounded-lg glass ecg-grid">
        <span className="text-display text-[var(--text-secondary)] opacity-50 tracking-widest">NO DATA</span>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.2} />
          <XAxis dataKey="timestamp" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', opacity: 0.6, fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 1]} stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', opacity: 0.6, fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0.25} stroke="var(--bio)" strokeDasharray="3 3" opacity={0.5} />
          <ReferenceLine y={0.5} stroke="var(--amber)" strokeDasharray="3 3" opacity={0.5} />
          <ReferenceLine y={0.75} stroke="var(--alert)" strokeDasharray="3 3" opacity={0.5} />
          <Area type="monotone" dataKey="score" stroke="var(--cyan)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
