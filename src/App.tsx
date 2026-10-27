import { AppProvider, useApp } from './store';
import { Landing } from './components/Landing';
import { GovDashboard } from './components/views/GovDashboard';
import { CreateTask } from './components/views/CreateTask';
import { TaskDetails } from './components/views/TaskDetails';
import { CollegeDashboard } from './components/views/CollegeDashboard';
import { InstituteDashboard } from './components/views/InstituteDashboard';
import { StudentDashboard } from './components/views/StudentDashboard';
import { ImpactDashboard } from './components/views/ImpactDashboard';

function Router() {
  const { view } = useApp();
  switch (view) {
    case 'landing': return <Landing />;
    case 'gov-dashboard': return <GovDashboard />;
    case 'gov-create': return <CreateTask />;
    case 'task-details': return <TaskDetails />;
    case 'activity-details': return <TaskDetails />;
    case 'college-dashboard': return <CollegeDashboard />;
    case 'institute-dashboard': return <InstituteDashboard />;
    case 'student-dashboard': return <StudentDashboard />;
    case 'impact': return <ImpactDashboard />;
    default: return <Landing />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
