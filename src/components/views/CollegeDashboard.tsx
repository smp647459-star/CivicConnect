import { useApp } from '../../store';
import { TopBar } from '../ui/TopBar';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { CivicMap } from '../ui/CivicMap';
import { BarChart } from '../ui/Charts';
import { TaskRow } from '../TaskRow';
import { MONTHLY_ACTIVITIES } from '../../data';
import { GraduationCap, Users, ClipboardList, CheckCircle2, Award, MapPin, Sparkles } from 'lucide-react';

export function CollegeDashboard() {
  const { tasks, colleges, students, navigate, impact } = useApp();
  const myCollege = colleges[2]; // PES University
  const nearby = tasks.filter((t) => t.status === 'open');
  const accepted = tasks.filter((t) => t.acceptedCollegeId === myCollege.id);
  const completed = accepted.filter((t) => t.status === 'completed');
  const myStudents = students.filter((s) => s.collegeId === myCollege.id);
  const monthly = MONTHLY_ACTIVITIES.map((m) => ({ label: m.month, value: m.count }));

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="College Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow"><GraduationCap className="h-6 w-6" /></div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{myCollege.name}</h1>
              <p className="text-slate-500 text-sm">{myCollege.location} · {myStudents.length} volunteers registered</p>
            </div>
          </div>
          <Button variant="outline" icon={<MapPin className="h-4 w-4" />} onClick={() => navigate('impact')}>Impact dashboard</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <StatCard label="Available volunteers" value={myCollege.availableVolunteers} icon={<Users className="h-5 w-5" />} accent="blue" />
          <StatCard label="Active tasks" value={accepted.filter((t) => t.status !== 'completed' && t.status !== 'rejected').length} icon={<ClipboardList className="h-5 w-5" />} accent="amber" />
          <StatCard label="Completed drives" value={completed.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
          <StatCard label="Past participations" value={myCollege.previousParticipations} icon={<Award className="h-5 w-5" />} accent="violet" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900">Nearby civic tasks</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{nearby.length} open</span>
              </div>
              <div className="space-y-2.5">
                {nearby.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">No open tasks nearby right now.</div>}
                {nearby.map((t) => (
                  <TaskRow key={t.id} task={t} actionLabel="Review & accept" onAction={() => navigate('task-details', t.id)} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-bold text-slate-900 mb-3">My college's tasks</h2>
              <div className="space-y-2.5">
                {accepted.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">Accept a nearby task to get started.</div>}
                {accepted.map((t) => <TaskRow key={t.id} task={t} actionLabel="Manage" onAction={() => navigate('task-details', t.id)} />)}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-900 mb-3 text-sm">Tasks near you (map)</h2>
              <CivicMap tasks={tasks} colleges={[myCollege]} className="h-60" highlightTaskId={null} onSelectTask={(id) => navigate('task-details', id)} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4 text-sm">Monthly activities</h2>
              <BarChart data={monthly} height={150} color="#2563eb" />
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white">
              <Sparkles className="h-5 w-5 mb-2" />
              <div className="font-bold">College impact</div>
              <div className="text-3xl font-extrabold mt-2">{completed.length + myCollege.previousParticipations}</div>
              <div className="text-sm text-emerald-100">total drives · {myCollege.rating}★ rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
