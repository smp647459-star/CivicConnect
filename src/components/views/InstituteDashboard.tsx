import { useApp } from '../../store';
import { TopBar } from '../ui/TopBar';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { CivicMap } from '../ui/CivicMap';
import { BarChart } from '../ui/Charts';
import { TaskRow } from '../TaskRow';
import { MONTHLY_ACTIVITIES } from '../../data';
import { Building2, Users, ClipboardList, CheckCircle2, Award, MapPin, CalendarClock, Send } from 'lucide-react';
import { formatDate } from '../../utils';
import type { CivicTask } from '../../types';

export function InstituteDashboard() {
  const { tasks, colleges, navigate } = useApp();
  const myCollege = colleges[2]; // PES University (institute view)
  const open = tasks.filter((t) => t.status === 'open');
  const accepted = tasks.filter((t) => t.acceptedCollegeId === myCollege.id);
  const completed = accepted.filter((t) => t.status === 'completed');
  const dateProposals = accepted.filter((t) => t.proposedDate !== null);
  const monthly = MONTHLY_ACTIVITIES.map((m) => ({ label: m.month, value: m.count }));

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="College Institute Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow"><Building2 className="h-6 w-6" /></div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{myCollege.name} · Institute</h1>
              <p className="text-slate-500 text-sm">{myCollege.location} · Institute coordination portal</p>
            </div>
          </div>
          <Button variant="outline" icon={<MapPin className="h-4 w-4" />} onClick={() => navigate('impact')}>Impact dashboard</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <StatCard label="Open drives nearby" value={open.length} icon={<ClipboardList className="h-5 w-5" />} accent="amber" />
          <StatCard label="Active commitments" value={accepted.filter((t) => t.status !== 'completed' && t.status !== 'rejected').length} icon={<Users className="h-5 w-5" />} accent="blue" />
          <StatCard label="Date proposals sent" value={dateProposals.length} icon={<CalendarClock className="h-5 w-5" />} accent="violet" />
          <StatCard label="Completed drives" value={completed.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900">Open civic drives</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{open.length} available</span>
              </div>
              <div className="space-y-2.5">
                {open.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">No open drives right now.</div>}
                {open.map((t) => (
                  <TaskRow key={t.id} task={t} actionLabel="Review & propose date" onAction={() => navigate('task-details', t.id)} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-bold text-slate-900 mb-3">Date proposals to municipality</h2>
              <div className="space-y-2.5">
                {dateProposals.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">Propose an activity date from a drive to see it here.</div>}
                {dateProposals.map((t) => <ProposalRow key={t.id} task={t} onOpen={() => navigate('task-details', t.id)} />)}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-900 mb-3 text-sm">Drives near you (map)</h2>
              <CivicMap tasks={tasks} colleges={[myCollege]} className="h-60" highlightTaskId={null} onSelectTask={(id) => navigate('task-details', id)} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4 text-sm">Monthly activities</h2>
              <BarChart data={monthly} height={150} color="#0d9f6e" />
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-5 text-white">
              <Award className="h-5 w-5 mb-2" />
              <div className="font-bold">Institute impact</div>
              <div className="text-3xl font-extrabold mt-2">{completed.length + myCollege.previousParticipations}</div>
              <div className="text-sm text-teal-100">total drives · {myCollege.rating}★ rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalRow({ task, onOpen }: { task: CivicTask; onOpen: () => void }) {
  const approved = task.dateApprovedByMunicipality;
  const statusLabel = approved === null ? 'Awaiting municipality' : approved ? 'Approved by municipality' : 'Rejected by municipality';
  const statusColor = approved === null ? 'text-amber-700 bg-amber-50 border-amber-200' : approved ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200';
  return (
    <button onClick={onOpen} className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-teal-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-slate-900 text-sm">{task.title}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><CalendarClock className="h-3 w-3" /> Proposed: {formatDate(task.proposedDate)}</div>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Send className="h-3 w-3" /> Sent {formatDate(task.dateSentToMunicipality)}</div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${approved === null ? 'bg-amber-500' : approved ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {statusLabel}
        </span>
      </div>
    </button>
  );
}
