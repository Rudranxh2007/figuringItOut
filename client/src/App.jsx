import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import DailyLog from './pages/DailyLog';
import Planner from './pages/Planner';
import Progress from './pages/Progress';
import Exercises from './pages/Exercises';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Supplementation from './pages/Supplementation';
import CalorieTracker from './pages/CalorieTracker';
import DailyMeals from './pages/DailyMeals';
import Alarms from './pages/Alarms';
import Recovery from './pages/Recovery';
import ActiveWorkout from './pages/ActiveWorkout';
import WaterIntake from './pages/WaterIntake';
import Sleep from './pages/Sleep';
import Meditation from './pages/Meditation';
import StressTracker from './pages/StressTracker';
import WeightTracker from './pages/WeightTracker';
import PRs from './pages/PRs';
import Measurements from './pages/Measurements';
import Challenges from './pages/Challenges';
import Habits from './pages/Habits';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Account from './pages/Account';

const Spinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400" />
  </div>
);

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-black text-white selection:bg-yellow-400 selection:text-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

const PR = ({ path, component: C }) => (
  <Route path={path} element={<ProtectedRoute><AppLayout><C /></AppLayout></ProtectedRoute>} />
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Protected */}
          <Route path="/"               element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/daily"          element={<ProtectedRoute><AppLayout><DailyLog /></AppLayout></ProtectedRoute>} />
          <Route path="/planner"        element={<ProtectedRoute><AppLayout><Planner /></AppLayout></ProtectedRoute>} />
          <Route path="/exercises"      element={<ProtectedRoute><AppLayout><Exercises /></AppLayout></ProtectedRoute>} />
          <Route path="/workout/active" element={<ProtectedRoute><AppLayout><ActiveWorkout /></AppLayout></ProtectedRoute>} />
          <Route path="/meals"          element={<ProtectedRoute><AppLayout><DailyMeals /></AppLayout></ProtectedRoute>} />
          <Route path="/calories"       element={<ProtectedRoute><AppLayout><CalorieTracker /></AppLayout></ProtectedRoute>} />
          <Route path="/supplements"    element={<ProtectedRoute><AppLayout><Supplementation /></AppLayout></ProtectedRoute>} />
          <Route path="/water"          element={<ProtectedRoute><AppLayout><WaterIntake /></AppLayout></ProtectedRoute>} />
          <Route path="/sleep"          element={<ProtectedRoute><AppLayout><Sleep /></AppLayout></ProtectedRoute>} />
          <Route path="/recovery"       element={<ProtectedRoute><AppLayout><Recovery /></AppLayout></ProtectedRoute>} />
          <Route path="/meditation"     element={<ProtectedRoute><AppLayout><Meditation /></AppLayout></ProtectedRoute>} />
          <Route path="/stress"         element={<ProtectedRoute><AppLayout><StressTracker /></AppLayout></ProtectedRoute>} />
          <Route path="/progress"       element={<ProtectedRoute><AppLayout><Progress /></AppLayout></ProtectedRoute>} />
          <Route path="/weight"         element={<ProtectedRoute><AppLayout><WeightTracker /></AppLayout></ProtectedRoute>} />
          <Route path="/prs"            element={<ProtectedRoute><AppLayout><PRs /></AppLayout></ProtectedRoute>} />
          <Route path="/measurements"   element={<ProtectedRoute><AppLayout><Measurements /></AppLayout></ProtectedRoute>} />
          <Route path="/challenges"     element={<ProtectedRoute><AppLayout><Challenges /></AppLayout></ProtectedRoute>} />
          <Route path="/habits"         element={<ProtectedRoute><AppLayout><Habits /></AppLayout></ProtectedRoute>} />
          <Route path="/achievements"   element={<ProtectedRoute><AppLayout><Achievements /></AppLayout></ProtectedRoute>} />
          <Route path="/settings"       element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
          <Route path="/notifications"  element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />
          <Route path="/account"        element={<ProtectedRoute><AppLayout><Account /></AppLayout></ProtectedRoute>} />
          <Route path="/alarms"         element={<ProtectedRoute><AppLayout><Alarms /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
