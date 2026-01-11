
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Briefcase, Plus, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const EmpresaDashboard = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-slate-800">Painel Corporativo</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
        <Plus size={20} />
        <span>Novo Profissional</span>
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
          <Users size={24} />
        </div>
        <p className="text-slate-400 text-sm">Total Profissionais</p>
        <p className="text-3xl font-bold text-slate-800">12</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
          <CheckCircle2 size={24} />
        </div>
        <p className="text-slate-400 text-sm">Instalações Concluídas</p>
        <p className="text-3xl font-bold text-slate-800">142</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
          <Clock size={24} />
        </div>
        <p className="text-slate-400 text-sm">Pendentes</p>
        <p className="text-3xl font-bold text-slate-800">5</p>
      </div>
    </div>
  </div>
);

export const ProfissionalDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Minha Agenda</h1>
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold">Próximos Atendimentos</h3>
        <span className="text-indigo-600 text-sm font-semibold">Hoje, 24 Out</span>
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                0{8 + i}:00
              </div>
              <div>
                <p className="font-semibold text-slate-800">Instalação Rastreador G500</p>
                <p className="text-sm text-slate-400 flex items-center">
                  <MapPin size={14} className="mr-1" /> Av. Paulista, 1000
                </p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ClienteDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Meus Serviços</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
        <h3 className="text-lg font-semibold mb-2 opacity-90">Agendar Novo Serviço</h3>
        <p className="text-sm opacity-75 mb-6">Precisa de uma nova instalação ou manutenção?</p>
        <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
          Solicitar Agora
        </button>
      </div>
      
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Serviço Atual</h3>
        <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-emerald-700 font-medium">Técnico em deslocamento</span>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p className="flex justify-between"><span className="text-slate-400">Técnico:</span> <span className="font-semibold">Marcos Silva</span></p>
          <p className="flex justify-between"><span className="text-slate-400">Veículo:</span> <span className="font-semibold">Toyota Corolla - ABC-1234</span></p>
          <p className="flex justify-between"><span className="text-slate-400">Previsão:</span> <span className="font-semibold text-indigo-600">14:30</span></p>
        </div>
      </div>
    </div>
  </div>
);
