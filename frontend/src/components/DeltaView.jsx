import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Scale } from 'lucide-react';

export default function DeltaView({ deltas }) {
  if (!deltas || !deltas.machineDeltas) {
    return null;
  }

  const { metricsDelta, machineDeltas } = deltas;

  return (
    <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/60 shadow-card-dark">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Senaryo Fark & Yük Kayması Analizi (+ / -)
          </h3>
          <p className="text-xs text-slate-400">
            Referans senaryoya kıyasla makine çalışma saatleri ve verimlilik değişimleri
          </p>
        </div>

        {metricsDelta && (
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="bg-[#080d19] px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Makespan Farkı: </span>
              <span className={metricsDelta.makespanDelta > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {metricsDelta.makespanDeltaStr}
              </span>
            </div>
            <div className="bg-[#080d19] px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Gecikme Farkı: </span>
              <span className={metricsDelta.tardyDelta > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {metricsDelta.tardyDeltaStr}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#080d19] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3 px-4 rounded-l-xl">Makine / Kaynak</th>
              <th className="py-3 px-4">Referans Yük</th>
              <th className="py-3 px-4">Yeni Yük</th>
              <th className="py-3 px-4">Saat Farkı (+ / -)</th>
              <th className="py-3 px-4">Kullanım Oranı Farkı</th>
              <th className="py-3 px-4 rounded-r-xl">Operasyon Adet Farkı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {machineDeltas.map((m) => {
              const isPositive = m.deltaHours > 0;
              const isNegative = m.deltaHours < 0;

              return (
                <tr key={m.resourceId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{m.resourceName}</td>
                  <td className="py-3 px-4">{m.baseHours} Sa</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{m.customHours} Sa</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                      isPositive ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : (isNegative ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400')
                    }`}>
                      {isPositive && <ArrowUpRight className="w-3 h-3 text-amber-400" />}
                      {isNegative && <ArrowDownRight className="w-3 h-3 text-emerald-400" />}
                      {!isPositive && !isNegative && <Minus className="w-3 h-3 text-slate-500" />}
                      {m.deltaHoursStr}
                    </span>
                  </td>
                  <td className="py-3 px-4">{m.deltaUtilStr}</td>
                  <td className="py-3 px-4 font-semibold">{m.deltaTaskStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
