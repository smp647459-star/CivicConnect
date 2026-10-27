import { useApp } from '../../store';
import { TopBar } from '../ui/TopBar';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { CivicMap } from '../ui/CivicMap';
import { BarChart, DonutChart } from '../ui/Charts';
import { TaskRow } from '../TaskRow';
import { CATEGORY_BREAKDOWN, MONTHLY_ACTIVITIES, COLLEGE_PARTICIPATION } from '../../data';
import { CATEGORY_COLORS } from '../../types';
import { AlertCircle, CheckCircle2, ClipboardList, Users2, Plus, MapPin, Building2, TrendingUp } from 'lucide-react';

export function GovDashboard() {
  const { tasks, colleges, impact, navigate } = useApp();
  const openTasks = tasks.filter((t) => t.status === 'open');
  const submittedTasks = tasks.filter((t) => t.status === 'submitted');

  const categoryData = CATEGORY_BREAKDOWN.map((c) => ({ label: c.category.split(' ')[0], value: c.count }));
  const donutData = CATEGORY_BREAKDOWN.map((c) => ({ label: c.category, value: c.count, color: CATEGORY_COLORS[c.category] ?? '#0d9f6e' }));
  const monthlyData = MONTHLY_ACTIVITIES.map((m) => ({ label: m.month, value: m.count }));
  const collegeData = COLLEGE_PARTICIPATION.map((c) => ({ label: c.name.split(' ')[0], value: c.count }));

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Government Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Municipal Control Center</h1>
            <p className="text-slate-500 text-sm mt-0.5">Bengaluru region · {openTasks.length} issues awaiting action</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={<TrendingUp className="h-4 w-4" />} onClick={() => navigate('impact')}>Impact</Button>
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('gov-create')}>Create Civic Task</Button>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <StatCard label="Active Civic Issues" value={impact.activeIssues} icon={<AlertCircle className="h-5 w-5" />} accent="rose" hint="Open" />
          <StatCard label="Tasks Assigned" value={impact.tasksAssigned} icon={<ClipboardList className="h-5 w-5" />} accent="amber" hint="In progress" />
          <StatCard label="Tasks Completed" value={impact.tasksCompleted} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" hint="Verified" />
          <StatCard label="Colleges Participating" value={impact.collegesConnected} icon={<Building2 className="h-5 w-5" />} accent="blue" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          {/* left: lists */}
          <div className="lg:col-span-2 space-y-6">
            {submittedTasks.length > 0 && (
              <section className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="font-bold text-slate-900">Awaiting verification</h2>
                  <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">{submittedTasks.length}</span>
                </div>
                <div className="space-y-2.5">
                  {submittedTasks.map((t) => (
                    <TaskRow key={t.id} task={t} actionLabel="Verify now" onAction={() => navigate('task-details', t.id)} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900">Open civic tasks</h2>
                <button onClick={() => navigate('gov-create')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">+ New task</button>
              </div>
              <div className="space-y-2.5">
                {openTasks.length === 0 && <div className="text-slate-400 text-sm bg-white border border-dashed rounded-xl p-6 text-center">No open tasks. Create one to start the workflow.</div>}
                {openTasks.map((t) => (
                  <TaskRow key={t.id} task={t} actionLabel="Assign college" onAction={() => navigate('task-details', t.id)} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-bold text-slate-900 mb-3">All tasks</h2>
              <div className="space-y-2.5">
                {tasks.filter((t) => t.status !== 'open' && t.status !== 'submitted').map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            </section>
          </div>

          {/* right: map + charts */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900">Civic Map</h2>
                <span className="text-xs text-slate-400">Mock</span>
              </div>
              <CivicMap tasks={tasks} colleges={colleges} className="h-72" onSelectTask={(id) => navigate('task-details', id)} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Tasks by category</h2>
              <DonutChart data={donutData} size={170} centerValue={`${CATEGORY_BREAKDOWN.reduce((s, c) => s + c.count, 0)}`} centerLabel="total" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Monthly activities</h2>
              <BarChart data={monthlyData} height={160} color="#2563eb" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">College participation</h2>
              <BarChart data={collegeData} height={160} color="#0d9f6e" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
