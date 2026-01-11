
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Loader2, Briefcase, Car, Building2, Shield } from 'lucide-react';
import { UserRole } from '../types';

export const Register = () => {
  const { signUp, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>("CLIENTE");
  const navigate = useNavigate();

  const validatePassword = (pass: string, r: UserRole): string | null => {
    if (pass.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
    
    if (r === "PROFISSIONAL" || r === "EMPRESA") {
      if (/^\d+$/.test(pass)) return "Senha profissional não pode ser apenas números.";
    }
    
    if (r === "ADMIN") {
      if (!/[a-zA-Z]/.test(pass)) return "Senha de admin deve conter letras.";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passError = validatePassword(password, role);
    if (passError) {
      alert(passError);
      return;
    }

    try {
      await signUp({ name, email, role, password });
      navigate('/');
    } catch (err) {}
  };

  const roles = [
    { id: "CLIENTE", label: "Cliente", icon: <Car size={20} />, desc: "Acompanhe seus serviços" },
    { id: "PROFISSIONAL", label: "Profissional", icon: <Briefcase size={20} />, desc: "Gestão de instalações" },
    { id: "EMPRESA", label: "Empresa", icon: <Building2 size={20} />, desc: "Gestão de frotas e equipe" },
    { id: "ADMIN", label: "Admin", icon: <Shield size={20} />, desc: "Acesso total" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-4 shadow-lg shadow-indigo-100">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Criar Nova Conta</h1>
          <p className="text-slate-500 mt-2">Selecione seu perfil para começar.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roles.map((r) => (
              <label 
                key={r.id} 
                className={`
                  relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-indigo-200
                  ${role === r.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100'}
                `}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value={r.id} 
                  className="hidden" 
                  onChange={() => setRole(r.id as UserRole)}
                  checked={role === r.id}
                />
                <div className={`mb-2 ${role === r.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {r.icon}
                </div>
                <span className={`font-semibold ${role === r.id ? 'text-indigo-800' : 'text-slate-700'}`}>{r.label}</span>
                <span className="text-xs text-slate-500 mt-1">{r.desc}</span>
                {role === r.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full"></div>
                )}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Seu Nome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="nome@email.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
                * Regras: Cliente (6+ chars), Profissional (6+, não apenas números), Admin (6+, deve conter letras).
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Criar Conta Agora</span>
                <UserPlus size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500">Já tem uma conta?</p>
          <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 mt-1 inline-block">
            Acessar minha conta
          </Link>
        </div>
      </div>
    </div>
  );
};
