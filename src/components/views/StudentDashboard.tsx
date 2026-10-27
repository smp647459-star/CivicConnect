import { useApp } from '../../store';
import { TopBar } from '../ui/TopBar';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TaskRow } from '../TaskRow';
import { CivicMap } from '../ui/CivicMap';
import { BarChart } from '../ui/Charts';
import { MONTHLY_ACTIVITIES } from '../../data';
import { Award, Flame, Calendar, CheckCircle2, Trophy, Star, Target, MapPin } from 'lucide-react';

export function StudentDashboard() {
  const { tasks, colleges, students, navigate } = useApp();
  const me = students[0]; // Aarav Sharma
  const myTasks = tasks.filter((t) => t.assignedStudents.includes(me.id));
  const myCollege = colleges.find((c) => c.id === me.collegeId);
  const completed = myTasks.filter((t) => t.status === 'completed');
  const active = myTasks.filter((t) => t.status !== 'completed' && t.status !== 'rejected');

  const monthly = MONTHLY_ACTIVITIES.map((m) => ({ label: m.month, value: Math.round(m.count / 8) }));

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Student Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-extrabold shadow">
              {me.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{me.name}</h1>
              <p className="text-slate-500 text-sm">{me.course} · {me.year} · {myCollege?.name}</p>
            </div>
          </div>
          <Button variant="outline" icon={<MapPin className="h-4 w-4" />} onClick={() => navigate('impact')}>Impact dashboard</Button>
        </div>

        {/* Civic points hero */}
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-800 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-emerald-300 text-sm font-semibold flex items-center gap-2"><Flame className="h-4 w-4" /> Civic Points</div>
              <div className="text-5xl font-extrabold mt-1 tabular-nums">{me.civicPoints}</div>
              <div className="text-slate-300 text-sm mt-1">{me.activities} verified activities</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {me.badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-sm font-semibold">
                  <Trophy className="h-4 w-4 text-amber-400" /> {b}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <StatCard label="Active activities" value={active.length} icon={<Target className="h-5 w-5" />} accent="amber" />
          <StatCard label="Completed" value={completed.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
          <StatCard label="Civic Points" value={me.civicPoints} icon={<Star className="h-5 w-5" />} accent="violet" />
          <StatCard label="Badges earned" value={me.badges.length} icon={<Award className="h-5 w-5" />} accent="rose" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="font-bold text-slate-900 mb-3">My active activities</h2>
              <div className="space-y-2.5">
                {active.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">No active activities. Join one from a civic task.</div>}
                {active.map((t) => <TaskRow key={t.id} task={t} actionLabel="Open activity" onAction={() => navigate('task-details', t.id)} />)}
              </div>
            </section>
            <section>
              <h2 className="font-bold text-slate-900 mb-3">Volunteering history</h2>
              <div className="space-y-2.5">
                {completed.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">Completed activities will appear here.</div>}
                {completed.map((t) => <TaskRow key={t.id} task={t} actionLabel="View proof" onAction={() => navigate('task-details', t.id)} />)}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-900 mb-3 text-sm">My activity map</h2>
              <CivicMap tasks={myTasks} colleges={myCollege ? [myCollege] : []} className="h-56" onSelectTask={(id) => navigate('task-details', id)} />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4 text-sm">My activities over time</h2>
              <BarChart data={monthly} height={140} color="#0d9f6e" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> Upcoming</h2>
              <div className="space-y-2 text-sm">
                {active.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span className="text-slate-700 truncate">{t.title.split('–')[0]}</span>
                    <span className="text-xs text-slate-400 font-medium">{t.deadline}</span>
                  </div>
                ))}
                {active.length === 0 && <div className="text-slate-400 text-xs">Nothing scheduled.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
