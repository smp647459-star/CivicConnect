import { useApp } from '../../store';
import { TopBar } from '../ui/TopBar';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BarChart, DonutChart, ProgressBar } from '../ui/Charts';
import { CivicMap } from '../ui/CivicMap';
import { CATEGORY_BREAKDOWN, MONTHLY_ACTIVITIES, COLLEGE_PARTICIPATION } from '../../data';
import { CATEGORY_COLORS } from '../../types';
import { ArrowLeft, CheckCircle2, Users, Building2, Activity, TrendingUp, Leaf, Sparkles, Award, MapPin } from 'lucide-react';

export function ImpactDashboard() {
  const { navigate, impact, tasks, colleges } = useApp();

  const donutData = CATEGORY_BREAKDOWN.map((c) => ({ label: c.category, value: c.count, color: CATEGORY_COLORS[c.category] ?? '#0d9f6e' }));
  const monthly = MONTHLY_ACTIVITIES.map((m) => ({ label: m.month, value: m.count }));
  const collegeBars = COLLEGE_PARTICIPATION.map((c) => ({ label: c.name.split(' ')[0], value: c.count }));
  const completion = { done: impact.tasksCompleted, total: tasks.length || 1 };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Impact Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <button onClick={() => navigate('landing')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl p-7 text-white relative overflow-hidden animate-fade-up">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-emerald-400/30 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Live impact — combines demo baseline + this session's activity
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">Civic impact, transparently measured</h1>
            <p className="text-emerald-100 mt-2 max-w-2xl">Every verified activity contributes to these numbers. Only government-verified work counts toward official impact and student Civic Points.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <HeroStat value={impact.issuesResolved} label="Issues resolved" icon={<Leaf className="h-5 w-5" />} />
              <HeroStat value={impact.collegesConnected} label="Colleges connected" icon={<Building2 className="h-5 w-5" />} />
              <HeroStat value={impact.studentVolunteers.toLocaleString()} label="Student volunteers" icon={<Users className="h-5 w-5" />} />
              <HeroStat value={`${impact.completionRate}%`} label="Completion rate" icon={<TrendingUp className="h-5 w-5" />} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <StatCard label="Active Civic Issues" value={impact.activeIssues} icon={<Activity className="h-5 w-5" />} accent="rose" />
          <StatCard label="Tasks Assigned" value={impact.tasksAssigned} icon={<Building2 className="h-5 w-5" />} accent="amber" />
          <StatCard label="Tasks Completed" value={impact.tasksCompleted} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
          <StatCard label="Community Activities" value={impact.communityActivities} icon={<Award className="h-5 w-5" />} accent="violet" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-4">Tasks by category</h2>
            <DonutChart data={donutData} size={180} centerValue={`${donutData.reduce((s, d) => s + d.value, 0)}`} centerLabel="tasks" />
          </Card>
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-4">Monthly activities</h2>
            <BarChart data={monthly} height={200} color="#0d9f6e" />
          </Card>
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-4">College participation</h2>
            <BarChart data={collegeBars} height={200} color="#2563eb" />
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-2">Completion rate</h2>
            <p className="text-sm text-slate-500 mb-4">Verified tasks vs total created.</p>
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-extrabold text-emerald-600">{impact.completionRate}%</span>
              <span className="text-sm text-slate-500">{completion.done}/{completion.total} this session</span>
            </div>
            <ProgressBar value={impact.completionRate} color="#0d9f6e" />
          </Card>

          <Card className="p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900">All civic activity (map)</h2>
              <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> Bengaluru · Mock</span>
            </div>
            <CivicMap tasks={tasks} colleges={colleges} className="h-72" onSelectTask={(id) => navigate('task-details', id)} />
          </Card>
        </div>

        <Card className="p-5 bg-amber-50/40 border-amber-200 animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="font-bold text-slate-900 text-sm">DEMO DATA notice</span>
          </div>
          <p className="text-sm text-slate-600">Aggregate figures blend an illustrative baseline (125 issues, 18 colleges, 2,450 volunteers, 320 activities, 87% completion) with live updates from tasks you create and verify in this session. This is a hackathon prototype using mock data.</p>
          <div className="mt-4 flex gap-3">
            <Button size="sm" onClick={() => navigate('gov-create')} icon={<Leaf className="h-3.5 w-3.5" />}>Create a task</Button>
            <Button size="sm" variant="outline" onClick={() => navigate('landing')}>Back to home</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function HeroStat({ value, label, icon }: { value: React.ReactNode; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur">
      <div className="text-emerald-200">{icon}</div>
      <div className="text-2xl font-extrabold mt-2 tabular-nums">{value}</div>
      <div className="text-sm text-emerald-100">{label}</div>
    </div>
  );
}
