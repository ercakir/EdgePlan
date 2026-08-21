import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

export default function ChartContainer({ tasks }) {
  const machineDefinitions = [
    { id: 'RES_CNC_01', shortName: '5-Eksen CNC', fullName: '5-Eksen CNC İşleme Merkezi' },
    { id: 'RES_CNC_02', shortName: '3-Eksen CNC', fullName: '3-Eksen CNC Freze Tezgahı' },
    { id: 'RES_LATHE_01', shortName: 'Hassas Torna', fullName: 'Hassas Torna Tezgahı' },
    { id: 'RES_ASY_01', shortName: 'Montaj Hattı', fullName: 'Otomatik Montaj Hattı' },
    { id: 'RES_QC_01', shortName: 'Kalite Kontrol', fullName: 'CMM Kalite Kontrol' },
    { id: 'RES_PACK_01', shortName: 'Paketleme', fullName: 'Paketleme & Sevkiyat' },
  ];

  // Calculate strict utilization rates per machine based on 38 Sa horizon formula
  const chartData = machineDefinitions.map((m) => {
    const resTasks = (tasks || []).filter(t => t.resourceId === m.id);
    const rawHours = resTasks.reduce((sum, t) => sum + (t.endHour - t.startHour), 0);
    const resHours = Math.round(rawHours * 10) / 10;
    const totalMs = 38.0;
    const utilPct = Math.min(100, Math.round((resHours / totalMs) * 100 * 10) / 10);

    return {
      id: m.id,
      name: m.shortName,
      fullName: m.fullName,
      hours: resHours,
      utilPct: utilPct,
      taskCount: resTasks.length
    };
  });

  // Process tasks for Gantt timeline (Limit to top active tasks if long to ensure sharp readability)
  const sortedTasks = [...(tasks || [])].sort((a, b) => a.startHour - b.startHour);
  const ganttData = (sortedTasks.length > 0)
    ? sortedTasks.slice(0, 10).map((task) => ({
        name: `${task.orderId} - ${task.operationName.length > 14 ? task.operationName.substring(0, 14) + '..' : task.operationName}`,
        machine: task.resourceName,
        start: task.startHour,
        duration: task.durationHours,
        end: task.endHour,
        isTardy: task.tardy
      }))
    : [
        { name: 'WO-2026-001 - Kaba Talaş', machine: '5-Eksen CNC', start: 0, duration: 4.5, end: 4.5, isTardy: false },
        { name: 'WO-2026-001 - Hassas Yüzey', machine: '5-Eksen CNC', start: 4.5, duration: 6.5, end: 11, isTardy: false },
        { name: 'WO-2026-002 - Torna Çap', machine: 'Hassas Torna', start: 0, duration: 5.4, end: 5.4, isTardy: false },
        { name: 'WO-2026-003 - Döküm Taşlama', machine: '3-Eksen CNC', start: 0, duration: 6.5, end: 6.5, isTardy: false },
      ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b1329] border border-cyan-500/40 p-3 rounded-xl shadow-card-dark text-xs space-y-1">
          <p className="font-extrabold text-white">{data.fullName}</p>
          <p className="text-cyan-300 font-mono">Çalışma Süresi: <strong>{data.hours} Sa / 38 Sa</strong></p>
          <p className="text-emerald-400 font-bold">Doluluk Oranı: <strong>%{data.utilPct}</strong></p>
          <p className="text-slate-400 text-[11px]">Atanmış Operasyon: {data.taskCount} Adet</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Güncel Makine Doluluk Oranları (%) */}
      <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/60 shadow-card-dark space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Güncel Makine Doluluk Oranları (%)</h3>
            <p className="text-xs text-slate-400">38 Saatlik Planlama Ufkuna Göre Kapasite Kullanım Yüzdeleri</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-lg">
            Formül Korumalı
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#cbd5e1' }} interval={0} textAnchor="middle" />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={100} label={{ value: '%100 Kapasite', fill: '#ef4444', fontSize: 10, position: 'top' }} stroke="#ef4444" strokeDasharray="3 3" />
              <Bar dataKey="utilPct" name="Doluluk Oranı (%)" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.utilPct === 0 ? '#ef4444' : entry.utilPct > 80 ? '#f59e0b' : '#10b981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Operasyon Süreçleri & Zaman Çizelgesi */}
      <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/60 shadow-card-dark space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base">Operasyon Süreçleri & Zaman Çizelgesi</h3>
            <p className="text-xs text-slate-400">Operasyonların başlama ve bitiş zamanları (Saat)</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-500/40 rounded-lg">
            {ganttData.length} Aktif Adım
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ganttData} layout="vertical" margin={{ top: 10, right: 15, left: 35, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" Sa" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#cbd5e1' }} width={140} interval={0} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0b1329', borderRadius: '12px', borderColor: '#334155', color: '#f8fafc' }}
                formatter={(value, name, item) => [
                  name === 'start' ? `${value} Sa (Başlangıç)` : `${value} Sa (Süre)`,
                  item.payload.machine
                ]}
              />
              <Bar dataKey="start" stackId="a" fill="transparent" />
              <Bar dataKey="duration" stackId="a" fill="#06b6d4" radius={[0, 6, 6, 0]}>
                {ganttData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isTardy ? '#ef4444' : '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
