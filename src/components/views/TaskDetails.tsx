import { useState } from 'react';
import { useApp } from '../../store';
import { TopBar } from '../ui/TopBar';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { CivicMap } from '../ui/CivicMap';
import { WorkflowStepper } from '../ui/WorkflowStepper';
import { matchColleges, type MatchResult } from '../../lib/matcher';
import { formatDate, timeAgo } from '../../utils';
import {
  ArrowLeft, MapPin, Users, Calendar, Tag, Boxes, ShieldCheck, Sparkles,
  GraduationCap, Check, X, Upload, Send, Clock, Award, ImageIcon, BadgeCheck,
  CalendarClock, Building2,
} from 'lucide-react';

const backView: Record<string, 'gov-dashboard' | 'college-dashboard' | 'student-dashboard' | 'institute-dashboard'> = {
  government: 'gov-dashboard',
  college: 'college-dashboard',
  student: 'student-dashboard',
  institute: 'institute-dashboard',
};

export function TaskDetails() {
  const {
    role, tasks, colleges, students, activeTaskId, navigate,
    recommendCollege, acceptTask, proposeDate, approveDate,
    joinActivity, markInProgress, uploadProof, submitForVerification, verifyTask,
  } = useApp();

  const task = tasks.find((t) => t.id === activeTaskId) ?? tasks[0];
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [showProof, setShowProof] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState('');
  const [afterPhoto, setAfterPhoto] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dateSent, setDateSent] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <div className="max-w-3xl mx-auto p-10 text-center text-slate-500">Task not found.</div>
      </div>
    );
  }

  const acceptedCollege = task.acceptedCollegeId ? colleges.find((c) => c.id === task.acceptedCollegeId) : null;
  const recommendedCollege = task.recommendedCollegeId ? colleges.find((c) => c.id === task.recommendedCollegeId) : null;
  const assignedStudents = students.filter((s) => task.assignedStudents.includes(s.id));
  const availableStudents = students.filter((s) => s.collegeId === task.acceptedCollegeId && !task.assignedStudents.includes(s.id));

  const runMatch = () => setMatches(matchColleges(task, colleges));
  const handleRecommend = (collegeId: string) => { recommendCollege(task.id, collegeId); setMatches(null); };
  const handleAccept = (collegeId: string) => acceptTask(task.id, collegeId);

  const sendDate = () => {
    if (!dateInput) return;
    proposeDate(task.id, dateInput);
    setDateSent(true);
  };

  const submitProof = () => {
    if (!beforePhoto || !afterPhoto) return;
    uploadProof(task.id, { beforePhoto, afterPhoto });
    if (task.status !== 'in-progress') markInProgress(task.id);
    submitForVerification(task.id);
    setShowProof(false);
  };

  const isCoordinatorLike = role === 'college' || role === 'institute';

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Task Details" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <button onClick={() => navigate(role ? backView[role] : 'landing')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-up">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-slate-400">Created {timeAgo(task.createdAt)}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">{task.title}</h1>
              <p className="text-slate-600 mt-1 max-w-2xl">{task.description}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <Meta icon={<MapPin className="h-4 w-4" />} label="Location" value={task.location} />
            <Meta icon={<Users className="h-4 w-4" />} label="Volunteers needed" value={`${task.volunteers}`} />
            <Meta icon={<Calendar className="h-4 w-4" />} label="Deadline" value={formatDate(task.deadline)} />
            <Meta icon={<Boxes className="h-4 w-4" />} label="Resources" value={task.resources || '—'} />
          </div>
        </div>

        <WorkflowStepper status={task.status} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Smart Matching */}
            {role === 'government' && task.status === 'open' && (
              <Card className="p-5 border-emerald-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    <h2 className="font-bold text-slate-900">Smart Matching</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Mock AI</span>
                  </div>
                  <Button size="sm" onClick={runMatch} icon={<Sparkles className="h-3.5 w-3.5" />}>Find nearby colleges</Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Weighted score from distance, available volunteers, past participation and specialization. Simulated, not real ML.</p>

                {matches && (
                  <div className="mt-4 space-y-3 animate-pop">
                    {matches.map((m, i) => (
                      <div key={m.college.id} className={`rounded-xl border p-4 ${i === 0 ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><GraduationCap className="h-5 w-5" /></div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                {m.college.name}
                                {i === 0 && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">BEST MATCH</span>}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{m.college.location} · {m.distance} km away</div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {m.reasons.map((r) => (
                                  <span key={r} className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{r}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">{m.score}</div>
                            <div className="text-[10px] text-slate-400 font-semibold">match score</div>
                            <button onClick={() => handleRecommend(m.college.id)} className="mt-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg">
                              Recommend
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recommendedCollege && !matches && (
                  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Recommended to {recommendedCollege.name}</div>
                        <div className="text-xs text-slate-500">Awaiting college acceptance…</div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Coordinator/Institute accept panel */}
            {isCoordinatorLike && task.status === 'open' && (
              <Card className="p-5 border-blue-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">Incoming civic task</h2>
                    <p className="text-sm text-slate-500 mt-1">Your institute can accept this task and mobilize volunteers.</p>
                  </div>
                  <Button onClick={() => handleAccept('col-3')} icon={<Check className="h-4 w-4" />}>Accept for PES University</Button>
                </div>
              </Card>
            )}

            {/* Date proposal panel (coordinator/institute) */}
            {isCoordinatorLike && (task.status === 'assigned' || task.status === 'in-progress') && (
              <Card className="p-5 border-violet-200">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-violet-600" />
                  <h2 className="font-bold text-slate-900">Activity date</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">Pick a date for the drive and send it to the municipality for confirmation.</p>

                {task.proposedDate ? (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="text-xs text-slate-500">Proposed date</div>
                          <div className="font-bold text-slate-900 text-lg">{formatDate(task.proposedDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Sent to municipality</div>
                          <div className="font-semibold text-slate-700 text-sm">{formatDate(task.dateSentToMunicipality)}</div>
                        </div>
                        <DateStatusBadge approved={task.dateApprovedByMunicipality} />
                      </div>
                    </div>
                    {task.dateApprovedByMunicipality === false && (
                      <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                        The municipality rejected this date. Pick a new date and resend.
                      </div>
                    )}
                    <div className="flex flex-wrap items-end gap-3">
                      <label className="block">
                        <span className="text-xs font-semibold text-slate-600 block mb-1">Change proposed date</span>
                        <input type="date" className="cc-input" value={dateInput} onChange={(e) => { setDateInput(e.target.value); setDateSent(false); }} />
                      </label>
                      <Button size="sm" onClick={sendDate} disabled={!dateInput || dateInput === task.proposedDate} icon={<Send className="h-3.5 w-3.5" />}>
                        {task.dateApprovedByMunicipality === false ? 'Resend to municipality' : 'Send to municipality'}
                      </Button>
                      {dateSent && <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Sent — awaiting confirmation</span>}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-600 block mb-1">Choose activity date</span>
                      <input type="date" className="cc-input" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
                    </label>
                    <Button size="sm" onClick={sendDate} disabled={!dateInput} icon={<Send className="h-3.5 w-3.5" />}>Send to municipality</Button>
                    {dateSent && <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Sent — awaiting confirmation</span>}
                  </div>
                )}
              </Card>
            )}

            {/* Government: date approval */}
            {role === 'government' && task.proposedDate && task.dateApprovedByMunicipality !== true && (
              <Card className="p-5 border-violet-200">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-violet-600" />
                  <h2 className="font-bold text-slate-900">Date proposal from college</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">The assigned college has proposed an activity date. Confirm or reject it.</p>
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-xs text-slate-500">Proposed activity date</div>
                    <div className="font-bold text-slate-900 text-lg">{formatDate(task.proposedDate)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Sent {formatDate(task.dateSentToMunicipality)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveDate(task.id, true)} icon={<Check className="h-4 w-4" />}>Confirm date</Button>
                    <Button size="sm" variant="danger" onClick={() => approveDate(task.id, false)} icon={<X className="h-4 w-4" />}>Reject</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Government: date confirmed banner */}
            {task.proposedDate && task.dateApprovedByMunicipality === true && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center gap-3">
                <Check className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Activity date confirmed by municipality</div>
                  <div className="text-xs text-slate-500">Scheduled for {formatDate(task.proposedDate)}</div>
                </div>
              </div>
            )}

            {/* College: register & assign students */}
            {isCoordinatorLike && (task.status === 'assigned' || task.status === 'in-progress') && acceptedCollege && (
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Student volunteers</h2>
                  <span className="text-sm text-slate-500">{assignedStudents.length}/{task.volunteers} joined</span>
                </div>
                {availableStudents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available to assign</div>
                    {availableStudents.map((s) => (
                      <div key={s.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">{s.name.split(' ').map((n) => n[0]).join('')}</div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.course} · {s.year}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => joinActivity(task.id, s.id)} icon={<Users className="h-3.5 w-3.5" />}>Assign</Button>
                      </div>
                    ))}
                  </div>
                )}
                {assignedStudents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned</div>
                    {assignedStudents.map((s) => (
                      <div key={s.id} className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">{s.name.split(' ').map((n) => n[0]).join('')}</div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.course}</div>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><Check className="h-3.5 w-3.5" /> Joined</span>
                      </div>
                    ))}
                  </div>
                )}
                {task.status === 'assigned' && assignedStudents.length > 0 && (
                  <Button className="mt-4" onClick={() => markInProgress(task.id)} icon={<Send className="h-4 w-4" />}>Start activity (mark In Progress)</Button>
                )}
              </Card>
            )}

            {/* Student: join + upload proof */}
            {role === 'student' && (
              <Card className="p-5">
                <h2 className="font-bold text-slate-900">Your activity</h2>
                {task.proposedDate && (
                  <div className="mt-2 text-sm text-slate-600 flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-violet-500" /> Scheduled: <span className="font-semibold text-slate-800">{formatDate(task.proposedDate)}</span>
                    {task.dateApprovedByMunicipality === true && <span className="text-xs font-semibold text-emerald-600 ml-1">(confirmed)</span>}
                  </div>
                )}
                {task.status === 'open' || task.status === 'assigned' ? (
                  <div className="mt-3 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Join this activity</div>
                      <div className="text-xs text-slate-500">{task.assignedStudents.includes('stu-1') ? 'You have joined.' : 'Earn 25 Civic Points on verification.'}</div>
                    </div>
                    {!task.assignedStudents.includes('stu-1') && (
                      <Button size="sm" onClick={() => joinActivity(task.id, 'stu-1')} icon={<Users className="h-3.5 w-3.5" />}>Join</Button>
                    )}
                  </div>
                ) : null}

                {(task.status === 'in-progress' || task.status === 'submitted') && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-slate-700">Before / After proof</div>
                      {task.status === 'in-progress' && <Button size="sm" variant="outline" onClick={() => setShowProof((v) => !v)} icon={<Upload className="h-3.5 w-3.5" />}>Upload proof</Button>}
                    </div>
                    {showProof && (
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3 animate-pop">
                        <PhotoPicker label="Before photo" value={beforePhoto} onChange={setBeforePhoto} />
                        <PhotoPicker label="After photo" value={afterPhoto} onChange={setAfterPhoto} />
                        <Button size="sm" onClick={submitProof} disabled={!beforePhoto || !afterPhoto} icon={<Send className="h-3.5 w-3.5" />}>Submit for verification</Button>
                      </div>
                    )}
                    {task.beforePhoto && task.afterPhoto && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <ProofImage label="Before" url={task.beforePhoto} />
                        <ProofImage label="After" url={task.afterPhoto} />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Government verification */}
            {role === 'government' && task.status === 'submitted' && (
              <Card className="p-5 border-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-bold text-slate-900">Verification required</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">Review the before/after proof and decide. Only verified work counts toward impact.</p>
                {task.beforePhoto && task.afterPhoto && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <ProofImage label="Before" url={task.beforePhoto} />
                    <ProofImage label="After" url={task.afterPhoto} />
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <Button onClick={() => verifyTask(task.id, true)} icon={<Check className="h-4 w-4" />}>Verify Completion</Button>
                  <Button variant="danger" onClick={() => verifyTask(task.id, false)} icon={<X className="h-4 w-4" />}>Reject</Button>
                </div>
              </Card>
            )}

            {/* Completed summary */}
            {task.status === 'completed' && (
              <Card className="p-5 border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-bold text-slate-900">Verified & Completed</h2>
                </div>
                <div className="text-sm text-slate-600 mt-1">Verified by {task.verifiedBy} on {formatDate(task.verifiedAt)}. Impact counted.</div>
                {task.beforePhoto && task.afterPhoto && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <ProofImage label="Before" url={task.beforePhoto} />
                    <ProofImage label="After" url={task.afterPhoto} />
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* side column */}
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Location on map</h3>
              <CivicMap tasks={[task]} colleges={acceptedCollege ? [acceptedCollege, ...colleges.filter((c) => c.id !== acceptedCollege.id)] : colleges} highlightTaskId={task.id} className="h-60" />
            </Card>

            {acceptedCollege && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 text-sm">Assigned college</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><GraduationCap className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{acceptedCollege.name}</div>
                    <div className="text-xs text-slate-500">{acceptedCollege.location}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <MiniStat value={acceptedCollege.availableVolunteers} label="Available" />
                  <MiniStat value={acceptedCollege.previousParticipations} label="Past drives" />
                  <MiniStat value={acceptedCollege.rating} label="Rating" />
                </div>
              </Card>
            )}

            {task.proposedDate && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><CalendarClock className="h-4 w-4 text-violet-500" /> Activity date</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <TimelineRow label="Proposed" value={formatDate(task.proposedDate)} />
                  <TimelineRow label="Sent to municipality" value={formatDate(task.dateSentToMunicipality)} />
                  <TimelineRow label="Municipality decision" value={task.dateApprovedByMunicipality === null ? 'Pending' : task.dateApprovedByMunicipality ? 'Confirmed' : 'Rejected'} />
                </div>
              </Card>
            )}

            {assignedStudents.length > 0 && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 text-sm">Volunteers ({assignedStudents.length})</h3>
                <div className="mt-3 space-y-2">
                  {assignedStudents.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{s.name.split(' ').map((n) => n[0]).join('')}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm truncate">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.activities} activities · {s.civicPoints} pts</div>
                      </div>
                      {s.badges.length > 0 && <Award className="h-4 w-4 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {task.submittedAt && (
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> Timeline</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <TimelineRow label="Created" value={formatDate(task.createdAt)} />
                  <TimelineRow label="Submitted" value={formatDate(task.submittedAt)} />
                  {task.verifiedAt && <TimelineRow label="Verified" value={formatDate(task.verifiedAt)} />}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DateStatusBadge({ approved }: { approved: boolean | null }) {
  if (approved === null) return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Awaiting municipality</span>;
  if (approved) return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Approved</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Rejected</span>;
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="text-xs text-slate-400 flex items-center gap-1.5">{icon} {label}</div>
      <div className="text-sm font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}

function MiniStat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="bg-slate-50 rounded-lg py-2">
      <div className="font-bold text-slate-900">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

const SAMPLE_PHOTOS = [
  'https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2689053/pexels-photo-2689053.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=600',
];

function PhotoPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-600 mb-1.5">{label}</div>
      {value ? (
        <div className="relative">
          <img src={value} alt={label} className="w-full h-32 object-cover rounded-lg" />
          <button onClick={() => onChange('')} className="absolute top-1 right-1 bg-black/60 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"><X className="h-3.5 w-3.5" /></button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_PHOTOS.map((p, i) => (
            <button key={i} onClick={() => onChange(p)} className="relative h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-100 transition">
              <img src={p} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/0 hover:bg-emerald-500/20 flex items-center justify-center transition">
                <ImageIcon className="h-4 w-4 text-white opacity-0 hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProofImage({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-600 mb-1.5">{label}</div>
      <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
        <img src={url} alt={label} className="w-full h-40 object-cover" />
        <div className="absolute top-2 left-2 bg-white/95 text-xs font-semibold px-2 py-1 rounded-md shadow flex items-center gap-1">
          <ImageIcon className="h-3 w-3 text-emerald-600" /> Geo-tagged
        </div>
      </div>
    </div>
  );
}
