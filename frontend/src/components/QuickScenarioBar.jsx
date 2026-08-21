import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function QuickScenarioBar({ onSubmitInstruction, isOptimizing }) {
  const [promptText, setPromptText] = useState('');
  const [lastSubmittedText, setLastSubmittedText] = useState(null);

  const presetInstructions = [
    { label: 'WO-2026-001 Acil Planla', text: 'WO-2026-001 siparişini acil öncelikle planla.' },
    { label: 'RES_CNC_01 Bakıma Al', text: 'RES_CNC_01 makinesini arıza/bakım nedeniyle devre dışı bırak.' },
    { label: 'Dengeli Yük Dağılımı', text: 'Makineler arası dengeli hat yüklemesi hedeflensin.' },
    { label: 'Gecikme Cezalarını Enküçült', text: 'Sipariş teslim tarihleri için gecikme cezalarını minimize et.' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (promptText.trim()) {
      setLastSubmittedText(promptText);
      onSubmitInstruction(promptText);
    }
  };

  const handlePresetClick = (text) => {
    setPromptText(text);
    setLastSubmittedText(text);
    onSubmitInstruction(text);
  };

  return (
    <div className="bg-[#0e1726] border border-cyan-500/40 rounded-2xl p-5 shadow-card-dark space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Hızlı Operasyonel Senaryo Asistanı (AI Prompt)</h3>
            <p className="text-xs text-slate-400">Doğal dille üretim talimatı girin veya hızlı senaryo butonlarına tıklayın</p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 bg-cyan-950 text-cyan-300 rounded-full border border-cyan-500/40 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Planlama Motoru Aktif
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Örn: WO-2026-001 acil planlansın veya RES_CNC_01 bakıma alınsın..."
          className="flex-1 bg-[#070c18] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isOptimizing || !promptText.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-neon-cyan cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isOptimizing ? 'Analiz Ediliyor...' : 'Analiz Et & Uygula'}
        </button>
      </form>

      {/* Action Result Success Badge */}
      {lastSubmittedText && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>[BAŞARILI] AI Analizi Uygulandı:</strong> "{lastSubmittedText}" senaryosu optimizasyon motoruna aktarıldı.</span>
          </div>
          <button onClick={() => setLastSubmittedText(null)} className="text-emerald-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Preset Chips */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-xs font-semibold text-slate-400">Örnek Senaryolar:</span>
        {presetInstructions.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePresetClick(chip.text)}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#101935] hover:bg-[#152247] text-cyan-300 border border-cyan-500/30 font-medium transition-all cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
