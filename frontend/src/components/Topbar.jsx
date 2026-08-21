import React from 'react';
import { RefreshCw, Play, ShieldCheck, Sparkles } from 'lucide-react';

export default function Topbar({ onRefresh, onRunOptimization, isOptimizing, activeTab }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Planlama & Genel Üretim Paneli';
      case 'scenarios': return 'Senaryo Simülasyonu & Parametre Ayarları';
      case 'resources': return 'Makine & Kaynak Kapasite Parkı';
      case 'orders': return 'Aktif İş Emirleri Portföyü';
      case 'reports': return 'Üretim Verimlilik ve KPI Raporları';
      default: return 'EdgePlan-AI Paneli';
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{getTabTitle()}</h2>
        <p className="text-xs text-slate-500 mt-0.5">OR-Tools & Spring Boot Tabanlı Akıllı Optimizasyon</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          Yenile
        </button>

        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isOptimizing ? 'Optimizasyon Hesaplanıyor...' : 'Optimizasyonu Çalıştır'}
        </button>
      </div>
    </header>
  );
}
