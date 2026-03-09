import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Builder from './pages/Builder';
import Templates from './pages/Templates';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#00b894',fontSize:'18px'}}>Loading...</div>;
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  if (!user && !token && !savedUser) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  return (
    <>
      <Toaster position="top-right" toastOptions={{style:{background:'#1a1a2e',color:'#fff',border:'1px solid #333'},success:{iconTheme:{primary:'#00b894',secondary:'#fff'}}}} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
