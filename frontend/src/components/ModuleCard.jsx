import React from 'react';
import { Maximize2, Cpu, CheckCircle2 } from 'lucide-react';

export default function ModuleCard({ title, subtitle, icon: Icon, colorTheme, badgeText, scoreText, isActive, onExpand }) {
  // Theme color definitions matching reference image
  const themeStyles = {
    blue: {
      border: 'border-blue-500/70',
      activeBorder: 'border-blue-400 ring-2 ring-blue-500/60',
      glow: 'shadow-neon-blue',
      iconBg: 'bg-blue-950/80 text-blue-400 border-blue-500/40',
      badge: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
      btn: 'bg-blue-600/30 text-blue-200 border-blue-500/50 hover:bg-blue-600/50',
    },
    emerald: {
      border: 'border-emerald-500/70',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-500/60',
      glow: 'shadow-neon-emerald',
      iconBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      btn: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50 hover:bg-emerald-600/50',
    },
    purple: {
      border: 'border-purple-500/70',
      activeBorder: 'border-purple-400 ring-2 ring-purple-500/60',
      glow: 'shadow-neon-purple',
      iconBg: 'bg-purple-950/80 text-purple-400 border-purple-500/40',
      badge: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      btn: 'bg-purple-600/30 text-purple-200 border-purple-500/50 hover:bg-purple-600/50',
    },
    cyan: {
      border: 'border-cyan-500/70',
      activeBorder: 'border-cyan-400 ring-2 ring-cyan-500/60',
      glow: 'shadow-neon-cyan',
      iconBg: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      btn: 'bg-cyan-600/30 text-cyan-200 border-cyan-500/50 hover:bg-cyan-600/50',
    },
    amber: {
      border: 'border-amber-500/70',
      activeBorder: 'border-amber-400 ring-2 ring-amber-500/60',
      glow: 'shadow-neon-amber',
      iconBg: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      btn: 'bg-amber-600/30 text-amber-200 border-amber-500/50 hover:bg-amber-600/50',
    },
  };

  const currentTheme = themeStyles[colorTheme] || themeStyles.blue;

  return (
    <div
      className={`h-[285px] w-full bg-[#0e1726] border-2 rounded-2xl p-5 shadow-card-dark flex flex-col justify-between transition-all duration-300 cursor-pointer ${
        isActive
          ? `${currentTheme.activeBorder} ${currentTheme.glow} translate-y-3.5 shadow-2xl`
          : `${currentTheme.border} translate-y-0 opacity-85 hover:opacity-100`
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Top Icon & Badge Header */}
          <div className="flex items-center justify-between mb-3 h-[40px]">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${currentTheme.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-1.5">
              {isActive && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  SEÇİLİ
                </span>
              )}
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${currentTheme.badge}`}>
                {badgeText || '4 Operasyon'}
              </span>
            </div>
          </div>

          {/* Card Title (Fixed Height Slot) */}
          <h3 className="text-base font-extrabold text-white tracking-tight h-[24px] flex items-center truncate">
            {title}
          </h3>

          {/* Card Subtitle (Fixed Height Slot) */}
          <p className="text-xs text-slate-400 mt-1 h-[36px] line-clamp-2 leading-snug">
            {subtitle}
          </p>

          {/* Department Score / Metric Line (Fixed Height Slot) */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs h-[30px]">
            <span className="text-slate-400">Modül Durumu:</span>
            <span className="font-bold text-white truncate max-w-[110px] text-right">{scoreText || 'Aktif'}</span>
          </div>
        </div>

        {/* Embedded Mini Box with "Büyüt" Button at Bottom */}
        <div className="bg-[#080d19] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 h-[52px]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate">EdgePlan Terminal</p>
              <p className="text-[9px] text-slate-500 truncate">Optimizasyon Modülü</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand && onExpand();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg text-[11px] font-bold border transition-all shrink-0 ${currentTheme.btn}`}
          >
            <Maximize2 className="w-3 h-3" />
            {isActive ? 'Açık' : 'Büyüt'}
          </button>
        </div>
      </div>
    </div>
  );
}
