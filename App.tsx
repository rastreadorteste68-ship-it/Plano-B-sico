
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EmpresaDashboard, ProfissionalDashboard, ClienteDashboard } from './pages/Dashboards';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard based on role
    const redirects: Record<string, string> = {
      ADMIN: '/admin',
      EMPRESA: '/empresa',
      PROFISSIONAL: '/profissional',
      CLIENTE: '/cliente'
    };
    return <Navigate to={redirects[user.role] || '/login'} />;
  }

  return <>{children}</>;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  const redirects: Record<string, string> = {
    ADMIN: '/admin',
    EMPRESA: '/empresa',
    PROFISSIONAL: '/profissional',
    CLIENTE: '/cliente'
  };
  return <Navigate to={redirects[user.role]} />;
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/empresa" element={
              <ProtectedRoute allowedRoles={['EMPRESA']}>
                <EmpresaDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profissional" element={
              <ProtectedRoute allowedRoles={['PROFISSIONAL']}>
                <ProfissionalDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/cliente" element={
              <ProtectedRoute allowedRoles={['CLIENTE']}>
                <ClienteDashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
}
