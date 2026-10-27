interface BarProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, color = '#0d9f6e', height = 180, formatValue }: BarProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3 px-1" style={{ height }}>
      {data.map((d) => {
        const h = Math.max(4, (d.value / max) * (height - 40));
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-2">
            <div className="text-xs font-semibold text-slate-700 tabular-nums">{formatValue ? formatValue(d.value) : d.value}</div>
            <div
              className="w-full max-w-[42px] rounded-t-lg transition-all duration-700 ease-out hover:opacity-90"
              style={{ height: h, background: `linear-gradient(180deg, ${color}, ${color}cc)` }}
            />
            <div className="text-[11px] text-slate-500 font-medium truncate w-full text-center">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

interface DonutProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 180, centerLabel, centerValue }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - 12;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="14" />
          {data.map((d, i) => {
            const len = (d.value / total) * circ;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth="14"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-extrabold text-slate-900">{centerValue}</div>
          <div className="text-xs text-slate-500">{centerLabel}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-600">{d.label}</span>
            <span className="font-semibold text-slate-900 ml-auto tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = '#0d9f6e' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
