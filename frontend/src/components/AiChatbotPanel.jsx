import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, ShieldCheck, HelpCircle, Zap, AlertTriangle, CheckCircle2, Lock, FileCode, ChevronUp, X } from 'lucide-react';

export default function AiChatbotPanel({ onApplySuggestedRequest, isOptimizing, userRole, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Merhaba! Ben MND AI Üretim Danışmanıyım. Size bugün nasıl yardımcı olabilirim?',
      suggestedRequest: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    {
      label: '⚡ 1. Kapasite & Darboğaz Analizi',
      query: 'Fabrikamızdaki en kritik tezgah darboğazı hangisidir ve Makespan süresini minimize etmek için yükü nasıl dengelemeliyiz?'
    },
    {
      label: '🚨 2. Gecikme & Teslim Uyum Riskleri',
      query: 'Teslim tarihi riski taşıyan iş emirlerini sıfırlamak için Gecikme Enküçültme (TARDINESS) optimizasyonu nasıl çalışır?'
    },
    {
      label: '🛠️ 3. Planlı Arıza / Bakım Simülasyonu',
      query: 'RES_CNC_01 5-Eksen tezgahı bakıma alınırsa üretimi kesintiye uğratmadan alternatif hatlara aktarabilir miyiz?'
    },
    {
      label: '🚀 4. Acil Sipariş Önceliklendirme',
      query: 'WO-2026-001 Türbin Kanatçık Seti siparişini acil seviyeye çıkarıp hatta ilk sıraya alabilir misiniz?'
    },
    {
      label: '📊 5. OEE & Maliyet Optimizasyonu',
      query: 'Tezgah aşınmalarını ve fazla mesai giderlerini azaltmak için Dengeli Hat Yüklemesi (BALANCED) stratejisi ne kazandırır?'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsTyping(true);

    try {
      // 1. Fetch AI Chat Advice
      const chatRes = await fetch('http://localhost:8080/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });
      const chatData = await chatRes.json();

      // 2. Fetch Intent Inspection Grounding
      let intentInspection = null;
      try {
        const intentRes = await fetch('http://localhost:8080/api/v1/intent/inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ textInstruction: textToSend })
        });
        intentInspection = await intentRes.json();
      } catch (err) {
        console.warn('Intent inspection fetch skipped:', err);
      }

      let responseText = chatData.responseAdvice || chatData.aiResponse || chatData.text || 'Cevap: Talebiniz başarıyla işlendi.\n\nÖneri: Çözücüyü çalıştırabilirsiniz.';
      // Clean out any ** asterisks just in case
      responseText = responseText.replace(/\*\*/g, '');

      const suggestedReq = chatData.suggestedRequest || chatData.suggestedOptimizationRequest || null;

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        suggestedRequest: suggestedReq,
        intentInspection: intentInspection,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Cevap: AI servisi yanıt verirken bir hata oluştu: ' + (err.message || err) + '\n\nÖneri: Bağlantınızı kontrol edin.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#0b1329] border border-cyan-500/50 rounded-2xl overflow-hidden shadow-card-dark flex flex-col h-[540px] transition-all animate-fade-in">
      {/* Header Bar with Collapse Button */}
      <div className="bg-[#0e1726] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-500/40 shadow-neon-cyan">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              MND AI Executive Assistant & Chatbot
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                CANLI AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Doğal dilde talep girin, niyet çıkarımını inceleyin ve fabrikanızı yönetin</p>
          </div>
        </div>

        {/* Dynamic Hide / Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#070c18] hover:bg-[#121e36] text-slate-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Paneli Gizle"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Paneli Gizle</span>
          </button>
        )}
      </div>

      {/* Messages Scrollable Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#070c18]/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
              <span>{msg.sender === 'user' ? 'Siz (Planlama)' : 'MND AI Asistanı'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[88%] p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-neon-cyan font-medium'
                  : 'bg-[#0e1726] border border-cyan-500/30 text-slate-200 rounded-tl-none shadow-card-dark space-y-3'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{msg.text}</div>

              {/* UNIFIED INTENT INSPECTOR STREAM ACCORDION */}
              {msg.intentInspection && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 bg-[#070c18] p-3.5 rounded-xl border border-cyan-500/40">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-cyan-300 text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Niyet Çıkarımı ve Güvenilirlik Raporu (Grounding)
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      msg.intentInspection.grounded
                        ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                        : 'bg-red-950 text-red-300 border-red-500/40'
                    }`}>
                      {msg.intentInspection.grounded ? 'GROUNDED (Doğrulandı)' : 'UNGROUNDED (Eşleşmedi)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-[#0b1329] p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block">Eşleşen Niyet:</span>
                      <strong className="text-white font-mono">{msg.intentInspection.detectedIntent || 'YOK'}</strong>
                    </div>
                    <div className="bg-[#0b1329] p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block">Risk Değerlendirmesi:</span>
                      <strong className={msg.intentInspection.riskAssessment?.includes('YÜKSEK') ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {msg.intentInspection.riskAssessment || 'DÜŞÜK RİSK'}
                      </strong>
                    </div>
                  </div>

                  {msg.intentInspection.entityValidationResults && msg.intentInspection.entityValidationResults.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400">Varlık (Entity) Kontrolleri:</span>
                      {msg.intentInspection.entityValidationResults.map((ev, i) => (
                        <div key={i} className="text-[10px] flex justify-between bg-[#0b1329] px-2 py-1 rounded border border-slate-800 font-mono">
                          <span className="text-slate-300">{ev.fieldName}: {ev.rawValue}</span>
                          <span className={ev.valid ? 'text-emerald-400' : 'text-red-400'}>
                            {ev.valid ? '✓ Var' : '❌ HATA: ' + ev.errorMessage}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grounding Failure Alert */}
                  {!msg.intentInspection.grounded && (
                    <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-[11px] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{msg.intentInspection.validationMessage}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button inside Chat Stream */}
              {msg.suggestedRequest && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-cyan-300">Önerilen Optimizasyon Hazır</span>
                  {userRole === 'YÖNETİCİ' ? (
                    <button
                      onClick={() => onApplySuggestedRequest && onApplySuggestedRequest(msg.suggestedRequest, msg.text)}
                      disabled={isOptimizing}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-[11px] transition-all shadow-neon-emerald flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{isOptimizing ? 'Uygulanıyor...' : '⚡ Talebi Çözücüye Gönder & Çalıştır'}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-1 rounded border border-amber-500/40 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      Yönetici Onayı Gerekli
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-[#0e1726] p-3 rounded-xl w-fit border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>MND AI fabrikanızı ve kısıtları analiz ediyor...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Sample Questions Chips */}
      <div className="px-4 py-2 bg-[#080d19] border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
        <span className="text-slate-500 font-bold shrink-0">Şık Yönetici Soruları:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.query)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded-lg bg-[#0e1726] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 shrink-0 transition-all cursor-pointer text-[10px] font-semibold"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Box Area */}
      <div className="p-3 bg-[#0e1726] border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Doğal dilde sorunuzu yazın (Örn: Fabrikamızdaki en kritik tezgah darboğazı hangisidir?)..."
          className="flex-1 bg-[#070c18] border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neon-cyan cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
