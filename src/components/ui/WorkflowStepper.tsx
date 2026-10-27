import type { TaskStatus } from '../../types';
import { Check, Upload, Send, ShieldCheck } from 'lucide-react';

const STEPS: { key: TaskStatus; label: string; icon: typeof Check }[] = [
  { key: 'open', label: 'Created', icon: Check },
  { key: 'assigned', label: 'College Assigned', icon: Check },
  { key: 'in-progress', label: 'In Progress', icon: Upload },
  { key: 'submitted', label: 'Proof Submitted', icon: Send },
  { key: 'completed', label: 'Verified', icon: ShieldCheck },
];

const ORDER: TaskStatus[] = ['open', 'assigned', 'in-progress', 'submitted', 'completed'];

export function WorkflowStepper({ status }: { status: TaskStatus }) {
  const currentIndex = status === 'rejected' ? ORDER.indexOf('submitted') : ORDER.indexOf(status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between gap-1 overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                    done ? 'bg-emerald-600 text-white' : active ? 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-[11px] font-medium text-center ${active || done ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 -mt-5 rounded ${i < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      {status === 'rejected' && (
        <div className="mt-4 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          Verification rejected — proof did not meet requirements. College may re-submit.
        </div>
      )}
    </div>
  );
}
