import type { CivicTask } from '../types';
import { useApp } from '../store';
import { StatusBadge, PriorityBadge } from './ui/Badge';
import { MapPin, Users, Calendar, Trash2, Droplets, Trees, Waves, Building, ArrowRight } from 'lucide-react';
import { CATEGORY_COLORS } from '../types';

const categoryIcon: Record<string, typeof Trash2> = {
  'Waste Management': Trash2,
  'Sanitation': Droplets,
  'Drainage': Droplets,
  'Public Spaces': Building,
  'Green Cover': Trees,
  'Water Bodies': Waves,
};

export function TaskRow({ task, actionLabel, onAction }: { task: CivicTask; actionLabel?: string; onAction?: () => void }) {
  const { navigate, colleges } = useApp();
  const Icon = categoryIcon[task.category] ?? MapPin;
  const college = task.acceptedCollegeId ? colleges.find((c) => c.id === task.acceptedCollegeId) : null;

  return (
    <div
      onClick={() => onAction ? onAction() : navigate('task-details', task.id)}
      className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${CATEGORY_COLORS[task.category] ?? '#0d9f6e'}15`, color: CATEGORY_COLORS[task.category] ?? '#0d9f6e' }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 leading-snug truncate">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {task.location}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {task.volunteers} vols</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {task.deadline}</span>
            {college && <span className="inline-flex items-center gap-1 text-blue-600 font-medium">{college.name}</span>}
          </div>
          <div className="flex items-center justify-between mt-3">
            <PriorityBadge priority={task.priority} />
            {actionLabel && (
              <button
                onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {actionLabel} <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
