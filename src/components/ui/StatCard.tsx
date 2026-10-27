import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: 'emerald' | 'blue' | 'amber' | 'rose' | 'violet' | 'cyan';
  hint?: string;
}

const accents = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', ring: 'ring-cyan-100' },
};

export function StatCard({ label, value, icon, accent = 'emerald', hint }: Props) {
  const a = accents[accent];
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text} ring-4 ${a.ring}`}>{icon}</div>
        {hint && <span className="text-xs font-medium text-slate-400">{hint}</span>}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{value}</div>
        <div className="text-sm text-slate-500 font-medium mt-1">{label}</div>
      </div>
    </div>
  );
}
