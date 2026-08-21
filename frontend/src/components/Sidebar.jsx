import React from 'react';
import { LayoutDashboard, Cpu, Layers, FileText, Sliders, CheckCircle2 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, backendStatus }) {
  const menuItems = [
    { id: 'dashboard', label: 'Planlama & Genel Bakış', icon: LayoutDashboard },
    { id: 'scenarios', label: 'Senaryo Simülasyonu', icon: Sliders },
    { id: 'resources', label: 'Makine & Kaynak Parkı', icon: Cpu },
    { id: 'orders', label: 'İş Emirleri', icon: Layers },
    { id: 'reports', label: 'Üretim Raporları', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen fixed left-0 top-0 z-30 shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            EP
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">EdgePlan<span className="text-emerald-600 font-extrabold">.AI</span></h1>
            <p className="text-xs text-slate-400 font-medium">Reborn Platform v1.0</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menü
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Spring Boot Engine</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {backendStatus ? `${backendStatus.orderCount} İş Emri Bağlı` : 'Bağlanıyor...'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
