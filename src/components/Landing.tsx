import { useState } from 'react';
import { useApp } from '../store';
import type { Role } from '../types';
import { Button } from './ui/Button';
import { Building2, GraduationCap, User, ShieldCheck, MapPin, Users, BarChart3, ArrowRight, Sparkles, CheckCircle2, Leaf, HandHeart } from 'lucide-react';

const steps = [
  { n: '01', title: 'Identify', desc: 'Government identifies a civic issue.', icon: MapPin },
  { n: '02', title: 'Connect', desc: 'The platform matches the issue with nearby colleges.', icon: ShieldCheck },
  { n: '03', title: 'Mobilize', desc: 'Colleges organize student volunteers.', icon: Users },
  { n: '04', title: 'Act', desc: 'Students complete the civic activity.', icon: HandHeart },
  { n: '05', title: 'Verify', desc: 'Government verifies the work with proof.', icon: CheckCircle2 },
  { n: '06', title: 'Measure', desc: 'Impact is recorded transparently.', icon: BarChart3 },
];

const impacts = [
  { value: '125', label: 'Civic issues resolved' },
  { value: '18', label: 'Colleges connected' },
  { value: '2,450', label: 'Student volunteers' },
  { value: '320', label: 'Community activities' },
  { value: '87%', label: 'Task completion rate' },
];

const roles: { role: Role; title: string; desc: string; icon: typeof Building2; accent: string }[] = [
  { role: 'government', title: 'Government / Municipality', desc: 'Post civic tasks, assign colleges, verify work.', icon: Building2, accent: 'from-emerald-500 to-emerald-600' },
  { role: 'college', title: 'College Coordinator', desc: 'Accept tasks, register & assign student volunteers.', icon: GraduationCap, accent: 'from-blue-500 to-blue-600' },
  { role: 'institute', title: 'College Institute', desc: 'Browse drives, propose activity dates to municipality.', icon: Building2, accent: 'from-teal-500 to-teal-600' },
  { role: 'student', title: 'Student Volunteer', desc: 'Join activities, upload proof, earn Civic Points.', icon: User, accent: 'from-cyan-500 to-cyan-600' },
];

export function Landing() {
  const { login, navigate } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow">CC</div>
            <span className="font-extrabold text-slate-900 text-lg">CivicConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <a href="#how" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700">How it works</a>
            <a href="#impact" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700">Impact</a>
            <a href="#roles" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700">For you</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('impact')}>Impact</Button>
            <Button size="sm" onClick={() => setShowLogin(true)}>Sign in</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50/40" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Government × College × Student collaboration
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight">
              Connecting <span className="text-emerald-600">Civic Problems</span> with Student Action.
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
              Empowering governments, colleges and students to work together for cleaner, safer and more sustainable communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" icon={<MapPin className="h-4 w-4" />} onClick={() => login('government')}>Report / Create Civic Task</Button>
              <Button size="lg" variant="outline" icon={<ArrowRight className="h-4 w-4" />} onClick={() => navigate('impact')}>Explore Civic Activities</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="md" variant="ghost" icon={<Building2 className="h-4 w-4" />} onClick={() => login('government')}>Government Login</Button>
              <Button size="md" variant="ghost" icon={<GraduationCap className="h-4 w-4" />} onClick={() => login('college')}>College Login</Button>
              <Button size="md" variant="ghost" icon={<Building2 className="h-4 w-4" />} onClick={() => login('institute')}>Institute Login</Button>
              <Button size="md" variant="ghost" icon={<User className="h-4 w-4" />} onClick={() => login('student')}>Student Login</Button>
            </div>
          </div>

          {/* hero visual: mini map card */}
          <div className="animate-fade-up relative" style={{ animationDelay: '120ms' }}>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-5 rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">Live Civic Map</div>
                  <div className="text-xs text-slate-500">Bengaluru · Mock data</div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> 4 active
                </span>
              </div>
              <HeroMapPreview />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <MiniStat icon={<MapPin className="h-3.5 w-3.5" />} value="3" label="Open" color="text-red-500" />
                <MiniStat icon={<Users className="h-3.5 w-3.5" />} value="1" label="Ongoing" color="text-amber-500" />
                <MiniStat icon={<CheckCircle2 className="h-3.5 w-3.5" />} value="1" label="Done" color="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Process</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">How CivicConnect Works</h2>
          <p className="text-slate-600 mt-3">A transparent six-step loop from civic issue to verified impact.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-100 group-hover:text-emerald-100 transition">{s.n}</span>
                </div>
                <h3 className="font-bold text-slate-900 mt-4 text-lg">{s.title}</h3>
                <p className="text-slate-600 mt-1.5 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Three roles, one mission</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Built for everyone in the loop</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.role}
                  onClick={() => login(r.role)}
                  className="text-left bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${r.accent} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mt-4 text-lg">{r.title}</h3>
                  <p className="text-slate-600 mt-1.5 text-sm">{r.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    Enter dashboard <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> DEMO DATA — illustrative prototype metrics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">Real civic impact, transparently measured</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {impacts.map((i) => (
            <div key={i.label} className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl border border-slate-200 p-6 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tabular-nums">{i.value}</div>
              <div className="text-sm text-slate-600 mt-2 font-medium">{i.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" icon={<BarChart3 className="h-4 w-4" />} onClick={() => navigate('impact')}>Open Impact Dashboard</Button>
          <Button variant="outline" icon={<Leaf className="h-4 w-4" />} onClick={() => login('government')}>Try the demo workflow</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold">CC</div>
            <div>
              <div className="font-bold text-white">CivicConnect</div>
              <div className="text-xs text-slate-400">Hackathon prototype · Mock data</div>
            </div>
          </div>
          <div className="text-xs text-slate-400">Connecting Civic Problems with Student Action.</div>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

function MiniStat({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="bg-slate-50 rounded-xl py-2.5">
      <div className={`flex items-center justify-center ${color}`}>{icon}</div>
      <div className="font-bold text-slate-900 mt-1">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

function HeroMapPreview() {
  const markers = [
    { x: 28, y: 35, c: 'bg-red-500' },
    { x: 60, y: 55, c: 'bg-red-500' },
    { x: 72, y: 28, c: 'bg-amber-400' },
    { x: 45, y: 70, c: 'bg-emerald-500' },
    { x: 80, y: 60, c: 'bg-red-500' },
  ];
  const colleges = [
    { x: 38, y: 25 },
    { x: 65, y: 42 },
  ];
  return (
    <div className="relative h-56 rounded-2xl overflow-hidden bg-emerald-50/40 border border-slate-200">
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(13,159,110,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(13,159,110,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <svg className="absolute inset-0 w-full h-full"><path d="M 0 60 Q 40 50 100 65" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.5" /><path d="M 50 0 L 55 100" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.4" /></svg>
      {colleges.map((c, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-600 shadow text-[10px]" style={{ left: `${c.x}%`, top: `${c.y}%` }}>🎓</div>
      ))}
      {markers.map((m, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
          <span className="relative flex h-3.5 w-3.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${m.c} opacity-60 animate-ping`} />
            <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${m.c} ring-2 ring-white shadow`} />
          </span>
        </div>
      ))}
    </div>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useApp();
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-pop" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-extrabold text-slate-900">Choose your role to sign in</h2>
        <p className="text-slate-500 mt-1 text-sm">Demo prototype — no password needed. Pick a role to enter its dashboard.</p>
        <div className="mt-5 space-y-3">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button key={r.role} onClick={() => { login(r.role); onClose(); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition text-left">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${r.accent} text-white flex items-center justify-center`}><Icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{r.title}</div>
                  <div className="text-xs text-slate-500">{r.desc}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </button>
            );
          })}
        </div>
        <button onClick={onClose} className="mt-5 w-full text-sm text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
      </div>
    </div>
  );
}
