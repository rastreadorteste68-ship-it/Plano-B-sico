
import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../services/firebase';
import { UserProfile } from '../../types';
import { 
  Users, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Eye,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await firebaseService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (uid: string) => {
    await firebaseService.toggleUserStatus(uid);
    fetchUsers();
    if (selectedUser?.uid === uid) {
       const updated = await firebaseService.getUserById(uid);
       setSelectedUser(updated);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
          <p className="text-slate-500">Controle de acesso e monitoramento de perfis.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Usuário</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Perfil</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 rounded-md text-[10px] font-bold uppercase
                        ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : ''}
                        ${u.role === 'EMPRESA' ? 'bg-blue-100 text-blue-700' : ''}
                        ${u.role === 'PROFISSIONAL' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${u.role === 'CLIENTE' ? 'bg-slate-100 text-slate-600' : ''}
                      `}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        {u.active ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-medium text-emerald-600">Ativo</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <span className="text-xs font-medium text-red-500">Inativo</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Panel */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Detalhes do Usuário</h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-400">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{selectedUser.name}</h4>
                    <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">E-mail de Acesso</p>
                    <p className="font-medium text-slate-700">{selectedUser.email}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">Cadastrado em</p>
                    <p className="font-medium text-slate-700">
                      {new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">UID Firebase</p>
                    <code className="font-mono text-[10px] text-slate-600 break-all">{selectedUser.uid}</code>
                  </div>
                </div>

                {/* Role Specific Details */}
                <div className="pt-4 border-t border-slate-100">
                  {selectedUser.role === 'EMPRESA' && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">Profissionais Vinculados:</span>
                      <span className="font-bold text-indigo-600">{selectedUser.professionalCount || 0}</span>
                    </div>
                  )}
                  {selectedUser.role === 'PROFISSIONAL' && (
                     <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-500">Status de Agenda:</span>
                      <span className="text-emerald-500 font-semibold">Disponível</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => toggleStatus(selectedUser.uid)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      selectedUser.active 
                        ? 'text-red-600 border-red-100 hover:bg-red-50' 
                        : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                    }`}
                  >
                    {selectedUser.active ? 'Bloquear Acesso' : 'Ativar Acesso'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <ShieldAlert className="mx-auto mb-4 opacity-20" size={48} />
              <p>Selecione um usuário para visualizar detalhes e gerenciar status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
