import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CivicTask, College, Student, View, Role } from './types';
import { seedTasks, seedColleges, seedStudents } from './data';

export type Phase = 'open' | 'assigned' | 'in-progress' | 'submitted' | 'verified' | 'completed' | 'rejected';

interface AppState {
  view: View;
  role: Role | null;
  tasks: CivicTask[];
  colleges: College[];
  students: Student[];
  activeTaskId: string | null;
  impact: ImpactStats;
  navigate: (view: View, taskId?: string) => void;
  login: (role: Role) => void;
  logout: () => void;
  createTask: (input: TaskInput) => string;
  recommendCollege: (taskId: string, collegeId: string) => void;
  acceptTask: (taskId: string, collegeId: string) => void;
  proposeDate: (taskId: string, date: string) => void;
  approveDate: (taskId: string, approve: boolean) => void;
  joinActivity: (taskId: string, studentId: string) => void;
  markInProgress: (taskId: string) => void;
  uploadProof: (taskId: string, proof: ProofInput) => void;
  submitForVerification: (taskId: string) => void;
  verifyTask: (taskId: string, approve: boolean) => void;
  registerStudent: (student: Omit<Student, 'id' | 'civicPoints' | 'badges' | 'activities'>) => void;
}

export interface TaskInput {
  title: string;
  category: string;
  description: string;
  location: string;
  volunteers: number;
  resources: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
}

export interface ProofInput {
  beforePhoto: string;
  afterPhoto: string;
}

export interface ImpactStats {
  issuesResolved: number;
  collegesConnected: number;
  studentVolunteers: number;
  communityActivities: number;
  completionRate: number;
  activeIssues: number;
  tasksAssigned: number;
  tasksCompleted: number;
}

const Ctx = createContext<AppState | null>(null);

let idCounter = 1000;
const nextId = (p: string) => `${p}-${++idCounter}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('landing');
  const [role, setRole] = useState<Role | null>(null);
  const [tasks, setTasks] = useState<CivicTask[]>(seedTasks);
  const [colleges] = useState<College[]>(seedColleges);
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const navigate = useCallback((v: View, taskId?: string) => {
    setView(v);
    if (taskId) setActiveTaskId(taskId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = useCallback((r: Role) => {
    setRole(r);
    setView(
      r === 'government' ? 'gov-dashboard'
        : r === 'college' ? 'college-dashboard'
        : r === 'institute' ? 'institute-dashboard'
        : 'student-dashboard',
    );
    window.scrollTo({ top: 0 });
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setView('landing');
  }, []);

  const createTask = useCallback((input: TaskInput) => {
    const id = nextId('task');
    const task: CivicTask = {
      id,
      ...input,
      status: 'open',
      createdAt: new Date().toISOString(),
      recommendedCollegeId: null,
      acceptedCollegeId: null,
      assignedStudents: [],
      beforePhoto: null,
      afterPhoto: null,
      submittedAt: null,
      verifiedAt: null,
      verifiedBy: null,
      coords: { lat: 12.9716 + (Math.random() - 0.5) * 0.08, lng: 77.5946 + (Math.random() - 0.5) * 0.08 },
      proposedDate: null,
      dateSentToMunicipality: null,
      dateApprovedByMunicipality: null,
    };
    setTasks((t) => [task, ...t]);
    return id;
  }, []);

  const recommendCollege = useCallback((taskId: string, collegeId: string) => {
    setTasks((t) => t.map((x) => (x.id === taskId ? { ...x, recommendedCollegeId: collegeId } : x)));
  }, []);

  const acceptTask = useCallback((taskId: string, collegeId: string) => {
    setTasks((t) => t.map((x) => (x.id === taskId ? { ...x, status: 'assigned', acceptedCollegeId: collegeId } : x)));
  }, []);

  const proposeDate = useCallback((taskId: string, date: string) => {
    setTasks((t) =>
      t.map((x) =>
        x.id === taskId ? { ...x, proposedDate: date, dateSentToMunicipality: new Date().toISOString(), dateApprovedByMunicipality: null } : x,
      ),
    );
  }, []);

  const approveDate = useCallback((taskId: string, approve: boolean) => {
    setTasks((t) => t.map((x) => (x.id === taskId ? { ...x, dateApprovedByMunicipality: approve } : x)));
  }, []);

  const joinActivity = useCallback((taskId: string, studentId: string) => {
    setTasks((t) =>
      t.map((x) =>
        x.id === taskId && !x.assignedStudents.includes(studentId)
          ? { ...x, assignedStudents: [...x.assignedStudents, studentId] }
          : x,
      ),
    );
  }, []);

  const markInProgress = useCallback((taskId: string) => {
    setTasks((t) => t.map((x) => (x.id === taskId ? { ...x, status: 'in-progress' } : x)));
  }, []);

  const uploadProof = useCallback((taskId: string, proof: ProofInput) => {
    setTasks((t) =>
      t.map((x) => (x.id === taskId ? { ...x, beforePhoto: proof.beforePhoto, afterPhoto: proof.afterPhoto } : x)),
    );
  }, []);

  const submitForVerification = useCallback((taskId: string) => {
    setTasks((t) => t.map((x) => (x.id === taskId ? { ...x, status: 'submitted', submittedAt: new Date().toISOString() } : x)));
  }, []);

  const verifyTask = useCallback((taskId: string, approve: boolean) => {
    setTasks((t) =>
      t.map((x) =>
        x.id === taskId
          ? {
              ...x,
              status: approve ? 'completed' : 'rejected',
              verifiedAt: new Date().toISOString(),
              verifiedBy: 'Gov. Officer',
            }
          : x,
      ),
    );
    if (approve) {
      setStudents((s) =>
        s.map((st) =>
          tasks.find((tk) => tk.id === taskId)?.assignedStudents.includes(st.id)
            ? { ...st, civicPoints: st.civicPoints + 25, activities: st.activities + 1, badges: awardBadge(st.civicPoints + 25) }
            : st,
        ),
      );
    }
  }, [tasks]);

  const registerStudent = useCallback((student: Omit<Student, 'id' | 'civicPoints' | 'badges' | 'activities'>) => {
    setStudents((s) => [...s, { ...student, id: nextId('stu'), civicPoints: 0, badges: [], activities: 0 }]);
  }, []);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const submitted = tasks.filter((t) => t.status === 'submitted').length;
  const assigned = tasks.filter((t) => t.status === 'assigned' || t.status === 'in-progress').length;
  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const impact: ImpactStats = {
    issuesResolved: completed + 110, // demo baseline + live
    collegesConnected: colleges.length + 6,
    studentVolunteers: students.length + 2390,
    communityActivities: total + 300,
    completionRate: Math.max(87, completionRate),
    activeIssues: tasks.filter((t) => t.status === 'open').length,
    tasksAssigned: assigned,
    tasksCompleted: completed,
  };

  return (
    <Ctx.Provider
      value={{
        view,
        role,
        tasks,
        colleges,
        students,
        activeTaskId,
        impact,
        navigate,
        login,
        logout,
        createTask,
        recommendCollege,
        acceptTask,
        proposeDate,
        approveDate,
        joinActivity,
        markInProgress,
        uploadProof,
        submitForVerification,
        verifyTask,
        registerStudent,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

function awardBadge(points: number): string[] {
  const badges: string[] = [];
  if (points >= 25) badges.push('Civic Starter');
  if (points >= 75) badges.push('Community Champion');
  if (points >= 150) badges.push('Civic Hero');
  return badges;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
