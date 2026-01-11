
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Calendar,
  History,
  ShieldAlert
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-600 hover:bg-white hover:text-indigo-600'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const menuItems = {
    ADMIN: [
      { label: 'Painel Admin', icon: <ShieldAlert size={20} />, path: '/admin' },
      { label: 'Usuários', icon: <Users size={20} />, path: '/admin/users' },
    ],
    EMPRESA: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/empresa' },
      { label: 'Profissionais', icon: <Users size={20} />, path: '/empresa/profissionais' },
      { label: 'Serviços', icon: <Briefcase size={20} />, path: '/empresa/servicos' },
    ],
    PROFISSIONAL: [
      { label: 'Agenda', icon: <Calendar size={20} />, path: '/profissional' },
      { label: 'Clientes', icon: <Users size={20} />, path: '/profissional/clientes' },
    ],
    CLIENTE: [
      { label: 'Meus Agendamentos', icon: <Calendar size={20} />, path: '/cliente' },
      { label: 'Histórico', icon: <History size={20} />, path: '/cliente/historico' },
    ],
  }[user.role];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">CheckMaster</h1>
          </div>

          <nav className="space-y-2">
            {menuItems?.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                signOut();
                navigate('/login');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-10">
          <button 
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 md:flex items-center px-4 hidden">
             <span className="text-sm font-medium text-slate-400 capitalize">{user.role.toLowerCase()} Area</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
