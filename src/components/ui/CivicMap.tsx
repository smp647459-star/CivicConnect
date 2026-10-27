import type { CivicTask, College, Coords } from '../../types';

interface Props {
  tasks: CivicTask[];
  colleges: College[];
  center?: Coords;
  highlightTaskId?: string | null;
  onSelectTask?: (id: string) => void;
  className?: string;
}

/** Mock stylized map — no external tile API. Rendered as a faux grid + markers. */
export function CivicMap({ tasks, colleges, highlightTaskId, onSelectTask, className = '' }: Props) {
  const center = { lat: 12.95, lng: 77.6 };
  const span = 0.12;

  const project = (c: Coords) => {
    const x = ((c.lng - (center.lng - span)) / (span * 2)) * 100;
    const y = (1 - (c.lat - (center.lat - span)) / (span * 2)) * 100;
    return { x: Math.max(4, Math.min(96, x)), y: Math.max(6, Math.min(94, y)) };
  };

  const colorFor = (status: string) =>
    status === 'completed'
      ? 'bg-emerald-500'
      : status === 'rejected'
        ? 'bg-rose-500'
        : status === 'submitted' || status === 'in-progress' || status === 'assigned'
          ? 'bg-amber-400'
          : 'bg-red-500';

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50/40 ${className}`}>
      {/* faux map grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(13,159,110,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,159,110,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* faux roads */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M 0 30 Q 30 35 60 28 T 100 32" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M 20 0 Q 25 40 18 70 T 22 100" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M 0 70 Q 40 65 70 72 T 100 68" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M 70 0 Q 65 30 75 60 T 70 100" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.4" />
      </svg>
      {/* faux water */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-100/40 rounded-tl-3xl" />
      <div className="absolute top-2 left-2 text-[10px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-md">Bengaluru · Mock Map</div>

      {/* college markers */}
      {colleges.map((c) => {
        const p = project(c.coords);
        return (
          <div key={c.id} className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <div className="flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-600 shadow-md text-xs font-bold">
                🎓
              </div>
              <div className="mt-1 hidden group-hover:block text-[9px] bg-white px-1.5 py-0.5 rounded shadow whitespace-nowrap text-slate-600">
                {c.name}
              </div>
            </div>
          </div>
        );
      })}

      {/* task markers */}
      {tasks.map((t) => {
        const p = project(t.coords);
        const active = t.id === highlightTaskId;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTask?.(t.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group ${active ? 'z-30' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-label={`Task: ${t.title}`}
          >
            <span className="relative flex">
              {(t.status === 'open' || active) && (
                <span className={`absolute inline-flex h-full w-full rounded-full ${colorFor(t.status)} opacity-60 animate-ping`} />
              )}
              <span
                className={`relative inline-flex rounded-full ${colorFor(t.status)} ring-2 ring-white shadow-lg transition-transform ${active ? 'h-5 w-5 scale-150' : 'h-4 w-4'}`}
              />
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[9px] bg-white/95 px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none text-slate-700 font-medium">
              {t.title.split('–')[0]}
            </span>
          </button>
        );
      })}

      {/* legend */}
      <div className="absolute bottom-2 left-2 bg-white/95 rounded-xl shadow px-3 py-2 flex flex-col gap-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Reported problem</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Ongoing activity</div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed</div>
        <div className="flex items-center gap-2"><span className="text-blue-600 font-bold">🎓</span> College</div>
      </div>
    </div>
  );
}
