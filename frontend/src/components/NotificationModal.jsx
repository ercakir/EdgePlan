import React, { useState } from 'react';
import { Bell, Check, X, ShieldAlert, User, Clock, ArrowRight, Zap, CheckCircle2, History, MessageSquare, AlertCircle } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, notifications, onApproveNotification, onRejectNotification }) {
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'HISTORY'

  if (!isOpen) return null;

  const pendingNotifications = notifications.filter(n => n.status === 'PENDING');
  const historyNotifications = notifications.filter(n => n.status !== 'PENDING');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0b1329] border border-cyan-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/40 shadow-neon-amber">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Yönetici Bildirim & Geçmiş Onay Merkezi</h3>
              <p className="text-xs text-slate-400">Gelen operatör talepleri, geçmiş onaylar ve sistem kayıtları</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PENDING'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-[#070c18] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Bekleyen Talepler ({pendingNotifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'HISTORY'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-[#070c18] text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Geçmiş Bildirim & Onaylar ({historyNotifications.length})</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto space-y-3.5 pr-1">
          {activeTab === 'PENDING' ? (
            pendingNotifications.length > 0 ? (
              pendingNotifications.map((notif) => (
                <div key={notif.id} className="bg-[#0e1726] p-4 rounded-xl border border-cyan-500/30 space-y-3 shadow-card-dark">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        <User className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">{notif.title}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{notif.operatorName || 'Operatör (Vardiya 1)'} • {notif.timestamp}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-amber-950 text-amber-300 border-amber-500/40">
                      ONAY BEKLİYOR
                    </span>
                  </div>

                  <div className="bg-[#070c18] p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-medium">{notif.details}</p>
                    {notif.targetMachine && (
                      <span className="inline-block text-[11px] text-cyan-300 font-mono">
                        İlgili Makine: <strong>{notif.targetMachine}</strong>
                      </span>
                    )}
                  </div>

                  {/* Manager Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onRejectNotification(notif.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                    >
                      Reddet
                    </button>

                    <button
                      onClick={() => onApproveNotification(notif)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-neon-emerald flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Onayla ve Ana Plan Olarak Uygula</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-44 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
                <p className="font-semibold">Bekleyen Yeni Operatör Bildirimi Yok</p>
                <p className="text-[11px] text-slate-500">Operatör modundan bir talep veya öneri gönderildiğinde burada görünecektir.</p>
              </div>
            )
          ) : (
            /* HISTORY TAB */
            historyNotifications.length > 0 ? (
              historyNotifications.map((notif) => (
                <div key={notif.id} className="bg-[#0e1726] p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border ${
                        notif.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-red-950 text-red-400 border-red-500/30'
                      }`}>
                        {notif.status === 'APPROVED' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">{notif.title}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">{notif.operatorName || 'Operatör'} • {notif.timestamp}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      notif.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-red-950 text-red-300 border-red-500/40'
                    }`}>
                      {notif.status === 'APPROVED' ? 'YÖNETİCİ ONAYLADI' : 'REDDEDİLDİ'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-[#070c18] p-2.5 rounded-lg border border-slate-800">{notif.details}</p>
                </div>
              ))
            ) : (
              <div className="h-44 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                <History className="w-8 h-8 text-slate-600" />
                <p className="font-semibold">Geçmiş Bildirim Kaydı Bulunmuyor</p>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
