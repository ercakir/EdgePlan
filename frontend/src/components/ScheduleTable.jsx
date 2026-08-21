import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ScheduleTable({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-[#0e1726] p-8 rounded-2xl border border-slate-700/60 shadow-card-dark text-center text-slate-400 text-sm">
        Çizelgelenmiş operasyon verisi bulunamadı.
      </div>
    );
  }

  return (
    <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/60 shadow-card-dark">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Detaylı Çizelgelenmiş Operasyon Listesi
          </h3>
          <p className="text-xs text-slate-400">
            Atanan makineler, başlama/bitiş zamanları ve teslim tarihi uygunluğu
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
          Toplam {tasks.length} Operasyon
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#080d19] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3 px-4 rounded-l-xl">İş Emri</th>
              <th className="py-3 px-4">Operasyon Adı</th>
              <th className="py-3 px-4">Atanan Makine</th>
              <th className="py-3 px-4">Başlangıç</th>
              <th className="py-3 px-4">Bitiş</th>
              <th className="py-3 px-4">İşlem Süresi</th>
              <th className="py-3 px-4">Teslim Tarihi</th>
              <th className="py-3 px-4 rounded-r-xl">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {tasks.map((task) => (
              <tr key={`${task.orderId}-${task.operationId}`} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{task.orderId}</td>
                <td className="py-3 px-4 font-medium text-slate-200">{task.operationName}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-500/40 font-semibold text-[11px]">
                    {task.resourceName}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-300">{task.startHour} Sa</td>
                <td className="py-3 px-4 font-semibold text-slate-300">{task.endHour} Sa</td>
                <td className="py-3 px-4 text-slate-400">{task.durationHours} Sa</td>
                <td className="py-3 px-4 text-slate-400">{task.dueDateHour} Sa</td>
                <td className="py-3 px-4">
                  {task.tardy ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950 text-red-300 border border-red-500/40 font-bold text-[11px]">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      +{task.latenessHours} Sa Gecikme
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px]">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      Zamanında
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
