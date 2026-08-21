import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, CheckCircle2, AlertTriangle, FileCode, Play, Lock } from 'lucide-react';

export default function HybridIntentPreviewGuard({ onConfirmAndOptimize, isOptimizing }) {
  const [promptText, setPromptText] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const samplePrompts = [
    { label: '🚀 WO-2026-001 Acil Planlansın', text: 'WO-2026-001 siparişini acil öncelikle planla.' },
    { label: '🛠️ RES_CNC_01 Bakıma Alınsın', text: 'RES_CNC_01 5-Eksen CNC tezgahı bakıma alınsın.' },
    { label: '⚠️ Var Olmayan Varlık Testi (WO-999)', text: 'WO-999 siparişini acil planla.' },
  ];

  const handleExtractIntents = async (textToExtract) => {
    const text = textToExtract || promptText;
    if (!text.trim()) return;

    setIsExtracting(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/intent/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText: text })
      });
      const data = await response.json();
      setPreviewData(data);
    } catch (err) {
      console.error('Extract error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirm = () => {
    if (previewData && onConfirmAndOptimize) {
      onConfirmAndOptimize(previewData);
    }
  };

  return (
    <div className="bg-[#0b1329] border border-cyan-500/50 rounded-2xl p-6 shadow-card-dark space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-neon-cyan">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              Hibrit Doğal Dil Niyet (Intent) & Önizleme / Onay Muhafızı (Preview Guard)
            </h3>
            <p className="text-xs text-slate-400">Fail-Closed Güvenlik: LLM çizelge üretmez; niyet çıkarır ve kullanıcı onayından geçerek OR-Tools'a aktarır</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Varlık Doğrulama Aktif
        </span>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExtractIntents();
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Örn: WO-2026-001 acil planlansın ve RES_CNC_01 bakıma alınsın..."
          className="flex-1 bg-[#070c18] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isExtracting || !promptText.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-neon-cyan cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isExtracting ? 'Niyet Çıkarılıyor...' : 'Niyet & Override Analiz Et'}
        </button>
      </form>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-semibold text-slate-400">Hızlı Test:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPromptText(p.text);
              handleExtractIntents(p.text);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#101935] hover:bg-[#152247] text-cyan-300 border border-cyan-500/30 font-semibold transition-all cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Live Preview Inspector (JSON & Grounding Check) */}
      {previewData && (
        <div className="bg-[#080d19] border border-slate-800 rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-xs">Çıkarılan Tipli Şema (Intent & Override Preview)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                previewData.overallRiskLevel === 'HIGH' ? 'bg-red-950 text-red-300 border-red-500/40' :
                previewData.overallRiskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              }`}>
                Risk Seviyesi: {previewData.overallRiskLevel}
              </span>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Kabul: {previewData.acceptedOverrideCount} / Red: {previewData.rejectedOverrideCount}
              </span>
            </div>
          </div>

          {/* Grounding Status Badges */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Varlık Doğrulama (Entity Grounding):</span>
            <div className="flex items-center gap-2 flex-wrap">
              {previewData.groundingChecks?.map((gc, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    gc.groundingStatus === 'GROUNDED'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-950/80 text-red-300 border-red-500/40'
                  }`}
                >
                  {gc.groundingStatus === 'GROUNDED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                  [{gc.entityType}] {gc.entityId}: {gc.groundingStatus}
                </span>
              ))}
            </div>
          </div>

          {/* Structured JSON Output Box */}
          <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-48 scrollbar-thin">
            <pre>{JSON.stringify(previewData, null, 2)}</pre>
          </div>

          {/* Explicit Confirmation Action Button */}
          {previewData.explicitChangeRequested && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-neon-emerald cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isOptimizing ? 'OR-Tools Çözüyor...' : 'Değişiklikleri Önizle ve Ana Plana Uygula (Açık Onay)'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
