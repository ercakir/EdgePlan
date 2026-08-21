import React, { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, Clock, ShieldAlert, Cpu, Power } from 'lucide-react';

export default function BreakdownGanttView({ resources, tasks, onToggleResourceBreakdown, disabledResourceIds }) {
  // Maintenance windows
  const maintenanceWindows = [
    { resourceId: 'RES_CNC_01', resourceName: '5-Eksen CNC (RES_CNC_01)', startHour: 12.0, endHour: 14.0, reason: 'Periyodik Yağ Değişimi & Spindle Bakımı' },
    { resourceId: 'RES_CNC_02', resourceName: '3-Eksen CNC (RES_CNC_02)', startHour: 24.0, endHour: 26.5, reason: 'Takım Sıfırlama & Kalibrasyon' },
  ];

  const maxTimelineHours = 36; // 0 to 36 hours view

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#0e1726] rounded-2xl border border-purple-500/40 shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/40 shadow-neon-purple">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">Makine Arıza & Bakım Durum Gantt Şeması</h3>
            <p className="text-xs text-slate-400">Tezgah bakımlarını, arıza pencerelerini ve gecikmeli operasyonları renk kodlu Gantt şemasında inceleyin</p>
          </div>
        </div>

        {/* Clean Single Dot Color Legend */}
        <div className="flex items-center gap-4 bg-[#070c18] px-4 py-2.5 rounded-xl border border-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shrink-0"></span>
            <span className="text-slate-200 font-semibold">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shrink-0"></span>
            <span className="text-slate-200 font-semibold">Geciken İş</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shrink-0"></span>
            <span className="text-slate-200 font-semibold">Arıza / Bakım</span>
          </div>
        </div>
      </div>

      {/* Machine Breakdown Quick Toggles */}
      <div className="bg-[#0e1726] p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-card-dark">
        <h4 className="font-bold text-white text-sm flex items-center gap-2">
          <Power className="w-4 h-4 text-purple-400" />
          Tezgah Parkı Durum Anahtarları (Arıza / Bakım İlan Et)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {resources.map(res => {
            const isDisabled = disabledResourceIds?.includes(res.resourceId);
            return (
              <button
                key={res.resourceId}
                onClick={() => onToggleResourceBreakdown && onToggleResourceBreakdown(res.resourceId)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isDisabled
                    ? 'bg-red-950/80 border-red-500 text-red-200 shadow-neon-red'
                    : 'bg-[#070c18] border-slate-800 text-slate-300 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold">{res.resourceId}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${isDisabled ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
                </div>
                <div className="text-xs font-bold truncate">{res.name}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block text-center ${
                  isDisabled ? 'bg-red-900 text-red-100' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {isDisabled ? '🔴 ARIZALI / DEVRE DIŞI' : '🟢 AKTİF / HAZIR'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color-Coded Breakdown & Maintenance Gantt Timeline Chart */}
      <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/80 shadow-card-dark space-y-4">
        <h4 className="font-bold text-white text-base flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Renk Kodlu Zaman Çizelgesi (Gantt View)
        </h4>

        {/* Timeline Hours Header */}
        <div className="flex text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2 pl-44">
          {[0, 4, 8, 12, 16, 20, 24, 28, 32, 36].map(h => (
            <div key={h} className="flex-1 text-center font-bold">
              {h}:00 Sa
            </div>
          ))}
        </div>

        {/* Per-Machine Gantt Rows */}
        <div className="space-y-4">
          {resources.map(res => {
            const isDisabled = disabledResourceIds?.includes(res.resourceId);
            const resTasks = tasks.filter(t => t.resourceId === res.resourceId);
            const resMaint = maintenanceWindows.filter(m => m.resourceId === res.resourceId);

            return (
              <div key={res.resourceId} className="flex items-center gap-3">
                {/* Machine Label Column */}
                <div className="w-44 shrink-0 bg-[#070c18] p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs truncate">{res.name}</span>
                    {isDisabled && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{res.resourceId}</span>
                </div>

                {/* Timeline Canvas */}
                <div className="flex-1 h-12 bg-[#070c18] rounded-xl border border-slate-800 relative overflow-hidden flex items-center">
                  {/* Grid Lines */}
                  {[0, 4, 8, 12, 16, 20, 24, 28, 32, 36].map(h => (
                    <div
                      key={h}
                      className="absolute top-0 bottom-0 border-r border-slate-800/40"
                      style={{ left: `${(h / maxTimelineHours) * 100}%` }}
                    />
                  ))}

                  {/* Maintenance Window Bands (Red Striped) */}
                  {resMaint.map((mw, idx) => {
                    const leftPct = (mw.startHour / maxTimelineHours) * 100;
                    const widthPct = ((mw.endHour - mw.startHour) / maxTimelineHours) * 100;
                    return (
                      <div
                        key={idx}
                        className="absolute h-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center text-[10px] font-bold text-red-200 z-10 animate-pulse"
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        title={`BAKIM PENCERESİ: ${mw.reason}`}
                      >
                        🔴 BAKIM ({mw.startHour}-{mw.endHour} Sa)
                      </div>
                    );
                  })}

                  {/* Machine Breakdown Full Overlay */}
                  {isDisabled && (
                    <div className="absolute inset-0 bg-red-950/90 border-2 border-red-500 z-20 flex items-center justify-center text-xs font-black text-red-200 animate-pulse">
                      🔴 TEZGAH ARIZALI / DEVRE DIŞI
                    </div>
                  )}

                  {/* Scheduled Tasks Bars */}
                  {!isDisabled && resTasks.map(t => {
                    const leftPct = Math.max(0, (t.startHour / maxTimelineHours) * 100);
                    const widthPct = Math.min(100, ((t.endHour - t.startHour) / maxTimelineHours) * 100);

                    // Color Coding Logic:
                    // 🔴 Red = Tardy / Delayed Task
                    // 🟡 Amber = Heavy Load Task
                    // 🟢 Green/Cyan = Normal On-Time Task
                    let barColor = 'bg-cyan-600 border-cyan-400 text-white';
                    if (t.tardy) {
                      barColor = 'bg-amber-600 border-amber-400 text-white shadow-neon-amber';
                    }

                    return (
                      <div
                        key={t.operationId}
                        className={`absolute h-8 rounded-lg border text-[10px] font-bold flex items-center px-2 truncate shadow-sm transition-all hover:scale-105 z-0 ${barColor}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        title={`[${t.orderId}] ${t.operationName} (${t.startHour}-${t.endHour} Sa) ${t.tardy ? '⚠️ GECİKEN İŞ' : '🟢 ZAMANINDA'}`}
                      >
                        {t.tardy ? '⚠️ ' : ''}[{t.orderId}] {t.operationId}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
