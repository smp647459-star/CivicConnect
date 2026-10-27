import { useState } from 'react';
import { useApp, type TaskInput } from '../../store';
import { TopBar } from '../ui/TopBar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { aiCategorize } from '../../utils';
import { Sparkles, MapPin, Tag, AlertTriangle, Wand2, Check, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Waste Management', 'Sanitation', 'Drainage', 'Public Spaces', 'Green Cover', 'Water Bodies'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

type FormState = Omit<TaskInput, 'priority'> & { priority: TaskInput['priority'] };

export function CreateTask() {
  const { navigate, createTask } = useApp();
  const [form, setForm] = useState<FormState>({
    title: '',
    category: '',
    description: '',
    location: '',
    volunteers: 20,
    resources: '',
    priority: 'High',
    deadline: '2026-11-02',
  });
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; priority: string } | null>(null);
  const [error, setError] = useState('');

  const update = (k: keyof FormState, v: string | number) => setForm((f) => ({ ...f, [k]: v }) as FormState);

  const runAI = () => {
    if (!form.description.trim()) return;
    const result = aiCategorize(form.description);
    setAiSuggestion(result);
  };

  const applyAI = () => {
    if (!aiSuggestion) return;
    setForm((f) => ({ ...f, category: aiSuggestion.category, priority: aiSuggestion.priority as TaskInput['priority'] }) as FormState);
  };

  const submit = () => {
    if (!form.title.trim() || !form.category || !form.location.trim()) {
      setError('Please fill title, category and location.');
      return;
    }
    const id = createTask(form);
    navigate('task-details', id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Create Civic Task" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate('gov-dashboard')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Create a Civic Task</h1>
          <p className="text-slate-500 text-sm mt-1">Report a civic issue. Smart Matching will recommend nearby colleges next.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5 space-y-4">
              <Field label="Task title" required>
                <input
                  className="cc-input"
                  placeholder="e.g. Garbage hotspot cleanup – Ward 12"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Problem category" required>
                  <select className="cc-input" value={form.category} onChange={(e) => update('category', e.target.value)}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Priority">
                  <select className="cc-input" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Description" hint="Describe the issue — our Smart Categorizer reads this to suggest a category.">
                <textarea
                  className="cc-input min-h-[110px] resize-y"
                  placeholder="e.g. Large amount of garbage near the bus stop causing foul smell and mosquito breeding…"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </Field>

              {/* AI suggestion box */}
              <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-violet-600" />
                    <span className="font-semibold text-sm text-violet-900">AI Civic Issue Categorization</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-violet-500 bg-violet-100 px-1.5 py-0.5 rounded">Mock AI</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={runAI} disabled={!form.description.trim()} icon={<Sparkles className="h-3.5 w-3.5" />}>Suggest</Button>
                </div>
                {aiSuggestion ? (
                  <div className="mt-3 flex items-center gap-3 animate-pop">
                    <div className="text-sm">
                      <span className="text-slate-500">Suggested — </span>
                      <span className="font-semibold text-slate-900">Category: {aiSuggestion.category}</span>
                      <span className="text-slate-300 mx-2">·</span>
                      <span className="font-semibold text-slate-900">Priority: {aiSuggestion.priority}</span>
                    </div>
                    <button onClick={applyAI} className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-white border border-violet-200 px-2 py-1 rounded-lg hover:bg-violet-100">
                      <Check className="h-3 w-3" /> Apply
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-violet-700/80">Type a description and click Suggest. This is a keyword-based simulation, not real ML.</p>
                )}
              </div>

              <Field label="Location" required>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input className="cc-input pl-9" placeholder="e.g. Ward 12, Jayanagar, Bengaluru" value={form.location} onChange={(e) => update('location', e.target.value)} />
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Required volunteers">
                  <input type="number" min={1} className="cc-input" value={form.volunteers} onChange={(e) => update('volunteers', Number(e.target.value))} />
                </Field>
                <Field label="Deadline">
                  <input type="date" className="cc-input" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
                </Field>
              </div>

              <Field label="Required resources">
                <input className="cc-input" placeholder="e.g. Gloves, masks, garbage bags, pickup truck" value={form.resources} onChange={(e) => update('resources', e.target.value)} />
              </Field>

              {error && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {error}</div>}

              <div className="flex gap-3 pt-2">
                <Button onClick={submit} icon={<Tag className="h-4 w-4" />}>Create task & match colleges</Button>
                <Button variant="ghost" onClick={() => navigate('gov-dashboard')}>Cancel</Button>
              </div>
            </Card>
          </div>

          {/* side preview */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-slate-900">Preview</h3>
              <p className="text-xs text-slate-500 mt-1">How officers will see this task.</p>
              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <div className="font-bold text-slate-900">{form.title || 'Task title'}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {form.location || 'Location'}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.category && <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{form.category}</span>}
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{form.priority}</span>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{form.volunteers} volunteers</span>
                </div>
                <p className="text-sm text-slate-600 mt-3 line-clamp-4">{form.description || 'Description preview…'}</p>
              </div>
            </Card>
            <Card className="p-5 bg-emerald-50/40 border-emerald-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-600" /> What happens next</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-600 list-decimal list-inside">
                <li>Task appears on the civic map (red marker).</li>
                <li>Smart Matching ranks nearby colleges.</li>
                <li>You recommend a college; they accept.</li>
                <li>Students join, upload proof, you verify.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-rose-500"> *</span>}
      </span>
      {hint && <span className="block text-xs text-slate-400 mt-0.5">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
