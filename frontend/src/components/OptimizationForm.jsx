import React, { useState } from 'react';
import { Sliders, AlertTriangle, Zap, Check } from 'lucide-react';

export default function OptimizationForm({ onSubmit, orders, resources, isOptimizing }) {
  const [objectiveType, setObjectiveType] = useState('MAKESPAN');
  const [priorityOverrides, setPriorityOverrides] = useState({
    'WO-2026-001': 3,
    'WO-2026-002': 2,
    'WO-2026-003': 1,
    'WO-2026-004': 2,
  });
  const [disabledResources, setDisabledResources] = useState([]);

  const handlePriorityChange = (orderId, newPriority) => {
    setPriorityOverrides(prev => ({
      ...prev,
      [orderId]: parseInt(newPriority)
    }));
  };

  const toggleResource = (resourceId) => {
    setDisabledResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      objectiveType,
      priorityOverrides,
      disabledResourceIds: disabledResources,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/60 shadow-card-dark space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Optimizasyon Parametreleri & Senaryo Ayarları
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            İş emri önceliklerini değiştirin veya makine arıza durumlarını simüle edin
          </p>
        </div>
        <button
          type="submit"
          disabled={isOptimizing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-neon-emerald disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          {isOptimizing ? 'Hesaplanıyor...' : 'Senaryoyu Simüle Et'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hedef Fonksiyon Seçimi */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Optimizasyon Hedefi
          </label>
          <div className="space-y-2">
            {[
              { id: 'MAKESPAN', label: 'Makespan Enküçültme (Süre)', desc: 'Tüm üretimi en kısa sürede tamamla' },
              { id: 'TARDINESS', label: 'Gecikme Cezası Enküçültme', desc: 'Teslim tarihi gecikmelerini minimize et' },
              { id: 'BALANCED', label: 'Dengeli Hat Yüklemesi', desc: 'Makineler arası dengeli yük dağılımı' },
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setObjectiveType(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  objectiveType === item.id
                    ? 'border-emerald-500 bg-emerald-950/40 text-white font-medium'
                    : 'border-slate-800 hover:border-slate-700 bg-[#080d19] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{item.label}</span>
                  {objectiveType === item.id && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* İş Emri Öncelikleri */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            İş Emri Öncelik Ayarları
          </label>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {(orders || []).map(order => (
              <div key={order.orderId} className="flex items-center justify-between p-2.5 bg-[#080d19] rounded-xl border border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{order.orderId}</p>
                  <p className="text-[11px] text-slate-400">{order.productFamily}</p>
                </div>
                <select
                  value={priorityOverrides[order.orderId] || order.priority}
                  onChange={(e) => handlePriorityChange(order.orderId, e.target.value)}
                  className="bg-[#0e1726] border border-slate-700 rounded-lg px-2 py-1 font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>Normal (1)</option>
                  <option value={2}>Yüksek (2)</option>
                  <option value={3}>Acil (3)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Makine Devre Dışı Bırakma / Arıza Simülasyonu */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Makine Arıza Simülasyonu
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(resources || []).map(res => {
              const isDisabled = disabledResources.includes(res.resourceId);
              return (
                <div
                  key={res.resourceId}
                  onClick={() => toggleResource(res.resourceId)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                    isDisabled
                      ? 'border-red-500/60 bg-red-950/40 text-red-300 font-semibold'
                      : 'border-slate-800 bg-[#080d19] text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${isDisabled ? 'text-red-400' : 'text-slate-500'}`} />
                    <span>{res.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                    isDisabled ? 'bg-red-900 text-red-200 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isDisabled ? 'Devre Dışı' : 'Aktif'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
