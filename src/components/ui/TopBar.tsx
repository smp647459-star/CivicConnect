import type { Role } from '../../types';
import { useApp } from '../../store';

const roleLabel: Record<Role, string> = {
  government: 'Government',
  college: 'College Coordinator',
  student: 'Student Volunteer',
  institute: 'College Institute',
};

export function TopBar({ title }: { title?: string }) {
  const { role, logout, navigate } = useApp();
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => navigate('landing')} className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-sm">CC</div>
          <div className="text-left">
            <div className="font-extrabold text-slate-900 leading-none">CivicConnect</div>
            {title && <div className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">{title}</div>}
          </div>
        </button>
        <div className="flex items-center gap-3">
          {role && (
            <>
              <span className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {roleLabel[role]}
              </span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
