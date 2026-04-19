import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CampaignCreate from './pages/CampaignCreate';
import CampaignDetail from './pages/CampaignDetail';
import ReviewFlow from './pages/ReviewFlow';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/campaigns/new" element={<ProtectedRoute><CampaignCreate /></ProtectedRoute>} />
          <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
          <Route path="/review/:campaignId" element={<ReviewFlow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
