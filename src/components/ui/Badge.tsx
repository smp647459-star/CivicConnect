import type { ReactNode } from 'react';
import type { TaskStatus } from '../../types';
import { STATUS_META, PRIORITY_META } from '../../types';

export function Badge({ children, color, bg, className = '' }: { children: ReactNode; color?: string; bg?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${color ?? 'text-slate-700'} ${bg ?? 'bg-slate-100'} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${m.bg} ${m.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const m = PRIORITY_META[priority] ?? PRIORITY_META['Medium'];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${m.bg} ${m.color}`}>{priority}</span>;
}
