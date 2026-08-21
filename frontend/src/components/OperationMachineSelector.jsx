import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Cpu, Sparkles, CheckCircle2, Play, AlertCircle, Info, ArrowRight } from 'lucide-react';

export default function OperationMachineSelector({ resources, orders, onApplyMachineSelection, isOptimizing, userRole }) {
  const [selectedOpId, setSelectedOpId] = useState('OP_101');
  const [selectedResId, setSelectedResId] = useState('RES_CNC_01');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // List of factory operations
  const operationsList = [
    { id: 'OP_101', name: 'WO-2026-001 - Kaba Talaş Kaldırma', defaultRes: 'RES_CNC_01' },
    { id: 'OP_102', name: 'WO-2026-001 - Hassas Yüzey İşleme', defaultRes: 'RES_CNC_01' },
    { id: 'OP_103', name: 'WO-2026-001 - Kalite Kontrol Ölçümü', defaultRes: 'RES_QC_01' },
    { id: 'OP_104', name: 'WO-2026-001 - Son Montaj & Muhafaza', defaultRes: 'RES_ASY_01' },
    { id: 'OP_201', name: 'WO-2026-002 - Silindir Dış Çap İşleme', defaultRes: 'RES_LATHE_01' },
    { id: 'OP_202', name: 'WO-2026-002 - Taşlama ve Parlatma', defaultRes: 'RES_CNC_02' },
    { id: 'OP_203', name: 'WO-2026-002 - Basınç Dayanım Testi', defaultRes: 'RES_QC_01' },
    { id: 'OP_301', name: 'WO-2026-003 - Döküm Gövde Taşlama', defaultRes: 'RES_CNC_02' },
    { id: 'OP_302', name: 'WO-2026-003 - Dişli Çark Frezeleme', defaultRes: 'RES_CNC_01' },
  ];

  // List of candidate machines
  const candidateResources = [
    { id: 'RES_CNC_01', name: '5-Eksen CNC İşleme Merkezi', cost: 120, efficiency: '100%' },
    { id: 'RES_CNC_02', name: '3-Eksen CNC Freze Tezgahı', cost: 85, efficiency: '90%' },
    { id: 'RES_LATHE_01', name: 'Hassas Torna Tezgahı', cost: 70, efficiency: '95%' },
    { id: 'RES_ASY_01', name: 'Otomatik Montaj Hattı', cost: 95, efficiency: '100%' },
    { id: 'RES_QC_01', name: 'CMM Kalite Kontrol İstasyonu', cost: 65, efficiency: '100%' },
  ];

  // Trigger background AI Agent analysis whenever operation or machine selection changes
  useEffect(() => {
    const runAiAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/scenario/analyze-machine-choice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationId: selectedOpId, preferredResourceId: selectedResId })
        });
        const data = await response.json();
        setAiAnalysis(data);
      } catch (err) {
        console.error('Scenario analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAiAnalysis();
  }, [selectedOpId, selectedResId]);

  const handleApplyChoice = () => {
    if (onApplyMachineSelection) {
      onApplyMachineSelection(selectedOpId, selectedResId);
    }
  };

  return (
    <div className="bg-[#0e1726] border border-cyan-500/40 rounded-2xl p-6 shadow-card-dark space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-neon-cyan">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Operasyon Bazlı Makine Seçimi & Arka Plan AI Analizi</h3>
            <p className="text-xs text-slate-400">Operasyona özel makine opsiyonunu belirleyin, AI ajanı olası senaryoyu analiz etsin</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Canlı AI Tahmin Motoru
        </span>
      </div>

      {/* Grid: Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Select Operation */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
            1. Hedef Operasyon Seçimi:
          </label>
          <select
            value={selectedOpId}
            onChange={(e) => setSelectedOpId(e.target.value)}
            className="w-full bg-[#070c18] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {operationsList.map(op => (
              <option key={op.id} value={op.id}>
                [{op.id}] {op.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">Çizelgelenecek fabrika operasyonu</p>
        </div>

        {/* Step 2: Select Compatible Machine Option */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
            2. Atanacak Makine Opsiyonu:
          </label>
          <select
            value={selectedResId}
            onChange={(e) => setSelectedResId(e.target.value)}
            className="w-full bg-[#070c18] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {candidateResources.map(res => (
              <option key={res.id} value={res.id}>
                [{res.id}] {res.name} (${res.cost}/Sa - {res.efficiency} Verim)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">Operasyonun işleneceği alternatif tezgah seçimi</p>
        </div>
      </div>

      {/* Step 3: Background AI Agent Scenario Analysis Box */}
      <div className="bg-[#070c18] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs">Arka Plan AI Ajanı Olası Senaryo Analizi</span>
          </div>
          {aiAnalysis && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Tahmin: {aiAnalysis.riskLevel}
            </span>
          )}
        </div>

        {isAnalyzing ? (
          <div className="py-4 text-center text-xs text-cyan-400 italic flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AI Ajanı makine atama senaryosunu simüle ediyor...</span>
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-200 font-medium leading-relaxed bg-[#0b1329] p-3 rounded-xl border border-slate-800">
              {aiAnalysis.aiAnalysisText}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#0b1329] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tahmini Makespan</span>
                <span className="text-sm font-extrabold text-cyan-400">{aiAnalysis.projectedMakespanHours} Sa</span>
              </div>
              <div className="bg-[#0b1329] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tahmini Gecikme</span>
                <span className="text-sm font-extrabold text-slate-200">{aiAnalysis.projectedTardyCount} Adet</span>
              </div>
              <div className="bg-[#0b1329] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Hat Verimliliği</span>
                <span className="text-sm font-extrabold text-emerald-400">%{aiAnalysis.projectedUtilizationPct}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Step 4: Execute & Compare Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleApplyChoice}
          disabled={isOptimizing || userRole !== 'YÖNETİCİ'}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-neon-cyan cursor-pointer disabled:opacity-50"
        >
          <span>Seçimi Uygula & Senaryoları Kıyasla</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
