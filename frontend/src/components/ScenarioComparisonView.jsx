import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Clock, AlertTriangle, FileText, CheckCircle2, Cpu, Info, Check, Sparkles, Layers, SlidersHorizontal, Play, RefreshCw, Wand2, Send, Lock, Download } from 'lucide-react';
import { exportScenarioComparisonPdf } from '../utils/scenarioPdfExporter';

export default function ScenarioComparisonView({ baselineSchedule, currentSchedule, deltas, metrics, tasks, resources, orders, onRunCustomScenario, onApplyScenarioAsMainPlan, userRole, onSendOperatorNotification }) {
  // Dynamic Custom Scenario Builder States
  const [disabledResId, setDisabledResId] = useState('');
  const [urgentOrderId, setUrgentOrderId] = useState('');
  const [targetOpId, setTargetOpId] = useState('');
  const [preferredResId, setPreferredResId] = useState('');
  const [objectiveType, setObjectiveType] = useState('MAKESPAN');

  // Dynamic Baseline Scenario A from API
  const baseMetrics = baselineSchedule?.metrics || {};
  const baseTasks = baselineSchedule?.tasks || [];

  const scenarioA = {
    title: 'Senaryo A: Standard Baz Plan (Referans)',
    solverStatus: baselineSchedule?.solverStatus || 'OPTIMAL',
    makespanHours: baseMetrics.makespanHours || 38.0,
    tardyCount: baseMetrics.tardyOrderCount || 0,
    utilizationPct: baseMetrics.totalMachineUtilizationPct || 30.5,
    solveTimeSeconds: baseMetrics.solverSolveTimeSeconds || 0.01,
    description: 'Tüm makineler aktif, standart ERP öncelik sıralaması (Canlı Çözücü Çıktısı)'
  };

  // Dynamic Custom Simulation Scenario B from API
  const liveMakespan = metrics?.makespanHours !== undefined ? metrics.makespanHours : 38.0;
  const liveTardy = metrics?.tardyOrderCount !== undefined ? metrics.tardyOrderCount : 0;
  const liveUtil = metrics?.totalMachineUtilizationPct !== undefined ? metrics.totalMachineUtilizationPct : 30.5;
  const liveSolveTime = metrics?.solverSolveTimeSeconds !== undefined ? metrics.solverSolveTimeSeconds : 0.015;

  const buildScenarioBDescription = () => {
    const parts = [];
    if (disabledResId) parts.push(`Devre Dışı Makine: ${disabledResId}`);
    if (urgentOrderId) parts.push(`Acil Sipariş: ${urgentOrderId}`);
    if (targetOpId && preferredResId) parts.push(`Atama: ${targetOpId} -> ${preferredResId}`);
    if (objectiveType !== 'MAKESPAN') parts.push(`Hedef: ${objectiveType}`);

    return parts.length > 0 ? parts.join(' | ') : 'Kullanıcı Tarafından Yapılandırılmış Özel Simülasyon Senaryosu (Canlı Çözücü)';
  };

  const scenarioB = {
    title: 'Senaryo B: Sizin Yapılandırdığınız Özel Senaryo',
    solverStatus: currentSchedule?.solverStatus || 'OPTIMAL',
    makespanHours: liveMakespan,
    tardyCount: liveTardy,
    utilizationPct: liveUtil,
    solveTimeSeconds: liveSolveTime,
    description: buildScenarioBDescription()
  };

  const makespanDiff = Math.round((scenarioB.makespanHours - scenarioA.makespanHours) * 10.0) / 10.0;

  // Handle Custom Scenario Execution
  const handleExecuteCustomScenario = () => {
    const params = {
      objectiveType: objectiveType,
      disabledResourceIds: disabledResId ? [disabledResId] : [],
      priorityOverrides: urgentOrderId ? { [urgentOrderId]: 3 } : {},
      machinePreferences: (targetOpId && preferredResId) ? { [targetOpId]: preferredResId } : {}
    };

    if (onRunCustomScenario) {
      onRunCustomScenario(params);
    }
  };

  const handleDownloadScenarioPdf = () => {
    exportScenarioComparisonPdf(baselineSchedule, currentSchedule, metrics, tasks, resources, orders);
  };

  const handleApplyOrSendNotification = () => {
    const params = {
      objectiveType: objectiveType,
      disabledResourceIds: disabledResId ? [disabledResId] : [],
      priorityOverrides: urgentOrderId ? { [urgentOrderId]: 3 } : {},
      machinePreferences: (targetOpId && preferredResId) ? { [targetOpId]: preferredResId } : {}
    };

    if (userRole === 'YÖNETİCİ') {
      if (onApplyScenarioAsMainPlan) {
        onApplyScenarioAsMainPlan({ title: scenarioB.title });
      }
    } else {
      if (onSendOperatorNotification) {
        onSendOperatorNotification({
          title: `📌 Operatör Senaryo Önerisi: ${scenarioB.title}`,
          details: `Operatör tarafından simüle edilen senaryo: ${scenarioB.description}. Tahmini Makespan: ${scenarioB.makespanHours} Sa.`,
          targetMachine: disabledResId || 'Genel Çizelge',
          params: params
        });
      }
    }
  };

  // Quick Pre-fill Templates
  const handleQuickPreFill = (type) => {
    if (type === 'CNC_BREAKDOWN') {
      setDisabledResId('RES_CNC_01');
      setUrgentOrderId('');
      setTargetOpId('');
      setPreferredResId('');
      setObjectiveType('MAKESPAN');
    } else if (type === 'URGENT_ORDER') {
      setDisabledResId('');
      setUrgentOrderId('WO-2026-001');
      setTargetOpId('');
      setPreferredResId('');
      setObjectiveType('MAKESPAN');
    } else if (type === 'MACHINE_SHIFT') {
      setDisabledResId('');
      setUrgentOrderId('');
      setTargetOpId('OP_101');
      setPreferredResId('RES_CNC_02');
      setObjectiveType('MAKESPAN');
    } else if (type === 'RESET') {
      setDisabledResId('');
      setUrgentOrderId('');
      setTargetOpId('');
      setPreferredResId('');
      setObjectiveType('MAKESPAN');
    }
  };

  const machineList = resources || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. DYNAMIC CUSTOM SCENARIO BUILDER PANEL WITH INTEGRATED COMPACT PDF BUTTON */}
      <div className="bg-[#0e1726] border border-cyan-500/50 rounded-2xl p-6 space-y-5 shadow-card-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-neon-cyan">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Serbest Senaryo Yapılandırıcı & Özgür Kıyaslama</h3>
              <p className="text-xs text-slate-400">Dilediğiniz tezgâhı arızaya alın, siparişi acil yapın veya operasyon atamasını özgürce belirleyin</p>
            </div>
          </div>

          {/* Action Chips & Integrated Sleek Compact PDF Download Button */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* COMPACT SLEEK PDF BUTTON INTEGRATED INTO TITLE BAR */}
            <button
              onClick={handleDownloadScenarioPdf}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-200 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer mr-1"
              title="Senaryo Kıyaslama Raporunu PDF Olarak İndir"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>📥 PDF Rapor</span>
            </button>

            <span className="text-[11px] font-bold text-slate-400">Hızlı Şablonlar:</span>
            <button onClick={() => handleQuickPreFill('CNC_BREAKDOWN')} className="text-[10px] font-bold px-2.5 py-1 bg-[#101935] hover:bg-[#162347] text-cyan-300 border border-cyan-500/30 rounded-lg cursor-pointer">
              🛠️ CNC Arızası
            </button>
            <button onClick={() => handleQuickPreFill('URGENT_ORDER')} className="text-[10px] font-bold px-2.5 py-1 bg-[#101935] hover:bg-[#162347] text-amber-300 border border-amber-500/30 rounded-lg cursor-pointer">
              ⚡ Acil Sipariş
            </button>
            <button onClick={() => handleQuickPreFill('MACHINE_SHIFT')} className="text-[10px] font-bold px-2.5 py-1 bg-[#101935] hover:bg-[#162347] text-emerald-300 border border-emerald-500/30 rounded-lg cursor-pointer">
              ⚙️ Tezgah Değişimi
            </button>
            <button onClick={() => handleQuickPreFill('RESET')} className="text-[10px] font-bold px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer">
              ↺ Sıfırla
            </button>
          </div>
        </div>

        {/* Builder Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Input 1: Machine Breakdown / Disable */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase">
              1. Arızalı / Devre Dışı Tezgah:
            </label>
            <select
              value={disabledResId}
              onChange={(e) => setDisabledResId(e.target.value)}
              className="w-full bg-[#070c18] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">-- Tüm Makineler Aktif --</option>
              {machineList.map(m => (
                <option key={m.resourceId} value={m.resourceId}>
                  🔴 [{m.resourceId}] {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input 2: Urgent Priority Work Order */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase">
              2. Acil Yapılacak İş Emri:
            </label>
            <select
              value={urgentOrderId}
              onChange={(e) => setUrgentOrderId(e.target.value)}
              className="w-full bg-[#070c18] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">-- Standart ERP Sıralaması --</option>
              {orders.map(o => (
                <option key={o.orderId} value={o.orderId}>
                  ⚡ [{o.orderId}] {o.productFamily}
                </option>
              ))}
            </select>
          </div>

          {/* Input 3: Operation Machine Assignment Shift */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase">
              3. Operasyon Atama Değişimi:
            </label>
            <div className="flex gap-2">
              <select
                value={targetOpId}
                onChange={(e) => setTargetOpId(e.target.value)}
                className="w-1/2 bg-[#070c18] border border-slate-700 rounded-xl px-2 py-2.5 text-[11px] text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">-- Operasyon --</option>
                <option value="OP_101">OP_101 Kaba Talaş</option>
                <option value="OP_102">OP_102 Hassas Yüzey</option>
                <option value="OP_201">OP_201 Torna Çap</option>
                <option value="OP_202">OP_202 Delik Delme</option>
                <option value="OP_301">OP_301 Döküm Taşlama</option>
              </select>

              <select
                value={preferredResId}
                onChange={(e) => setPreferredResId(e.target.value)}
                className="w-1/2 bg-[#070c18] border border-slate-700 rounded-xl px-2 py-2.5 text-[11px] text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="">-- Hedef Makine --</option>
                {machineList.map(m => (
                  <option key={m.resourceId} value={m.resourceId}>{m.resourceId}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Input 4: Optimization Objective */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase">
              4. Optimizasyon Hedefi:
            </label>
            <select
              value={objectiveType}
              onChange={(e) => setObjectiveType(e.target.value)}
              className="w-full bg-[#070c18] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="MAKESPAN">⏱️ Makespan Enküçültme (En Hızlı Bitiş)</option>
              <option value="TARDINESS">🎯 Gecikme Enküçültme (Teslim Odaklı)</option>
              <option value="BALANCED">⚖️ Dengeli Hat Yüklemesi (Eşit Tezgah Dağılımı)</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleExecuteCustomScenario}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-neon-cyan cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Özel Senaryomu Simüle Et ve Baz Planla Kıyasla</span>
          </button>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE DYNAMIC SCENARIO CARDS (Scenario A vs Scenario B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario A Card (Dynamic API Baseline) */}
        <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/80 shadow-card-dark space-y-5">
          <div className="pb-3 border-b border-slate-800 space-y-1">
            <h4 className="font-bold text-white text-base">{scenarioA.title}</h4>
            <p className="text-xs text-slate-400">{scenarioA.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Çözücü Durumu</span>
              <div className="text-xl font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                {scenarioA.solverStatus}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Makespan (Maksimum Bitiş)</span>
              <div className="text-3xl font-black text-white tracking-tight mt-0.5">
                {scenarioA.makespanHours} <span className="text-sm font-semibold text-slate-400">Saat</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Geciken Sipariş Sayısı</span>
              <div className="text-2xl font-extrabold text-slate-200 mt-0.5">
                {scenarioA.tardyCount}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Makine Doluluk Oranı (%)</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-0.5">
                %{scenarioA.utilizationPct}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Çözüm Süresi</span>
              <div className="text-lg font-bold text-slate-300 font-mono mt-0.5">
                {scenarioA.solveTimeSeconds} s
              </div>
            </div>
          </div>
        </div>

        {/* Scenario B Card (Dynamic API Simulation) */}
        <div className="bg-[#0e1726] p-6 rounded-2xl border border-cyan-500/50 shadow-card-dark space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-800 flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-base">{scenarioB.title}</h4>
                <p className="text-xs text-cyan-300 font-semibold mt-0.5">{scenarioB.description}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-lg shrink-0">
                Aktif Özel Simülasyon
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Çözücü Durumu</span>
                <div className="text-xl font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  {scenarioB.solverStatus}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Makespan (Maksimum Bitiş)</span>
                <div className="text-3xl font-black text-cyan-400 tracking-tight mt-0.5">
                  {scenarioB.makespanHours} <span className="text-sm font-semibold text-slate-400">Saat</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Geciken Sipariş Sayısı</span>
                <div className={`text-2xl font-extrabold mt-0.5 ${scenarioB.tardyCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {scenarioB.tardyCount}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Makine Doluluk Oranı (%)</span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                  %{scenarioB.utilizationPct}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Çözüm Süresi</span>
                <div className="text-lg font-bold text-slate-300 font-mono mt-0.5">
                  {scenarioB.solveTimeSeconds} s
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Apply / Notify Action Button */}
          <div className="pt-4 border-t border-slate-800">
            {userRole === 'YÖNETİCİ' ? (
              <button
                onClick={handleApplyOrSendNotification}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-neon-emerald flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Bu Özel Senaryoyu Seç & Ana Fabrika Planı Olarak Uygula</span>
              </button>
            ) : (
              <button
                onClick={handleApplyOrSendNotification}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-neon-amber flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>📌 Bu Senaryoyu Beğendim - Yöneticiye Bildirim Gönder</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. 100% DYNAMIC MACHINE ASSIGNMENT TABLE FROM BACKEND SOLVER TASKS */}
      <div className="bg-[#0e1726] rounded-2xl border border-cyan-500/40 overflow-hidden shadow-card-dark space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h4 className="font-extrabold text-white text-base">Hangi Makinede Hangi İş Yapılıyor? (Canlı Atamalar)</h4>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-cyan-950 text-cyan-300 rounded-lg border border-cyan-500/30">
            Baz Plan A vs Özel Senaryo B İş Dağılımı
          </span>
        </div>

        <div className="space-y-4">
          {machineList.map((m) => {
            const baseTasksForRes = baseTasks.filter(t => t.resourceId === m.resourceId);
            const scenarioBTasksForRes = tasks.filter(t => t.resourceId === m.resourceId);
            const isDisabled = disabledResId === m.resourceId;

            return (
              <div key={m.resourceId} className="bg-[#070c18] p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-xs">{m.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({m.resourceId})</span>
                  </div>
                  <span className={`text-[11px] font-bold ${isDisabled ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isDisabled ? '🔴 ARIZALI / DEVRE DIŞI' : `${scenarioBTasksForRes.length} Operasyon Atandı`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Scenario A Operations (Dynamic Baseline Tasks) */}
                  <div className="bg-[#0b1329] p-3 rounded-lg border border-slate-800 space-y-2">
                    <span className="block font-bold text-slate-300 text-[11px] uppercase">Senaryo A (Baz Plan) Atamaları:</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {baseTasksForRes.length > 0 ? (
                        baseTasksForRes.map(t => (
                          <div key={t.operationId} className="px-2.5 py-1 rounded bg-[#070c18] text-cyan-300 border border-slate-800 flex justify-between">
                            <span>[{t.orderId}] {t.operationId} {t.operationName}</span>
                            <span className="text-slate-400">({t.startHour}-{t.endHour} Sa)</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-2.5 py-1 rounded bg-[#070c18] text-slate-500">Operasyon atanmamış</div>
                      )}
                    </div>
                  </div>

                  {/* Scenario B Operations (Dynamic Current Solver Tasks) */}
                  <div className="bg-[#0b1329] p-3 rounded-lg border border-cyan-500/30 space-y-2">
                    <span className="block font-bold text-cyan-300 text-[11px] uppercase">Senaryo B (Sizin Simülasyonunuz) Atamaları:</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {isDisabled ? (
                        <div className="px-2.5 py-1.5 rounded bg-red-950/80 text-red-200 border border-red-500/50 font-bold">
                          🔴 TEZGAH ARIZALI / DEVRE DIŞI (İş Yapılmıyor)
                        </div>
                      ) : scenarioBTasksForRes.length > 0 ? (
                        scenarioBTasksForRes.map(t => (
                          <div key={t.operationId} className="px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-200 border border-cyan-500/40 font-bold flex items-center justify-between">
                            <span>[{t.orderId}] {t.operationId} {t.operationName}</span>
                            <span className="text-[10px] text-cyan-400 font-semibold">({t.startHour}-{t.endHour} Sa)</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-2.5 py-1 rounded bg-slate-900 text-slate-400">Atanmış operasyon yok</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Summary Explanation Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white text-sm">Senaryo Karşılaştırma Özeti:</span>
          <p className="leading-relaxed">
            Standart Baz Plan A'da üretim süresi <strong>{scenarioA.makespanHours} Saat</strong> iken, yapılandırdığınız <strong>{scenarioB.description}</strong> uygulandığında üretim süresi <strong>{scenarioB.makespanHours} Saat</strong> olarak hesaplanmıştır.
            {makespanDiff > 0 ? (
              <span className="text-amber-300 ml-1">
                (Süre <strong>+{makespanDiff} Saat</strong> uzamaktadır).
              </span>
            ) : makespanDiff < 0 ? (
              <span className="text-emerald-300 ml-1">
                (Süre <strong>{Math.abs(makespanDiff)} Saat</strong> kısalmaktadır).
              </span>
            ) : (
              <span className="text-cyan-300 ml-1">
                (Süre tam aynı kalmaktadır).
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
