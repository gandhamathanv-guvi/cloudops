import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { CourseOverview } from './pages/CourseOverview';
import { CoursePage } from './pages/CoursePage';
import { LabPage } from './pages/LabPage';
import { useAuth } from './hooks/useAuth';
import Shell from './pages/shell';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shell" element={<Shell />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />
        <Route
          path="/course/:id"
          element={
              <CourseOverview />
          }
        />
        <Route
          path="/lab/:labId/test"
          element={
            // <PrivateRoute>
              <LabPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/lab/:labId"
          element={
            // <PrivateRoute>
              <CoursePage />
            // </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;