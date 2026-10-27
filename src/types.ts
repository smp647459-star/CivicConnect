export type Role = 'government' | 'college' | 'student' | 'institute';

export type View =
  | 'landing'
  | 'gov-dashboard'
  | 'gov-create'
  | 'task-details'
  | 'college-dashboard'
  | 'activity-details'
  | 'student-dashboard'
  | 'institute-dashboard'
  | 'impact';

export type TaskStatus = 'open' | 'assigned' | 'in-progress' | 'submitted' | 'completed' | 'rejected';

export interface Coords {
  lat: number;
  lng: number;
}

export interface CivicTask {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  volunteers: number;
  resources: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  recommendedCollegeId: string | null;
  acceptedCollegeId: string | null;
  assignedStudents: string[];
  beforePhoto: string | null;
  afterPhoto: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  coords: Coords;
  proposedDate: string | null;
  dateSentToMunicipality: string | null;
  dateApprovedByMunicipality: boolean | null;
}

export interface College {
  id: string;
  name: string;
  location: string;
  coords: Coords;
  availableVolunteers: number;
  totalStudents: number;
  previousParticipations: number;
  specializations: string[];
  rating: number;
}

export interface Student {
  id: string;
  name: string;
  collegeId: string;
  course: string;
  year: string;
  civicPoints: number;
  badges: string[];
  activities: number;
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Waste Management': '#0d9f6e',
  'Sanitation': '#2563eb',
  'Drainage': '#0891b2',
  'Public Spaces': '#7c3aed',
  'Green Cover': '#16a34a',
  'Water Bodies': '#0284c7',
};

export const STATUS_META: Record<TaskStatus, { label: string; color: string; bg: string; dot: string }> = {
  open: { label: 'Open', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
  assigned: { label: 'Assigned', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  'in-progress': { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-yellow-500' },
  submitted: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', dot: 'bg-rose-500' },
};

export const PRIORITY_META: Record<string, { color: string; bg: string }> = {
  Low: { color: 'text-slate-600', bg: 'bg-slate-100' },
  Medium: { color: 'text-blue-700', bg: 'bg-blue-100' },
  High: { color: 'text-orange-700', bg: 'bg-orange-100' },
  Critical: { color: 'text-red-700', bg: 'bg-red-100' },
};
