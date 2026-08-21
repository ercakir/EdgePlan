import React, { useState } from 'react';
import { Bell, ShieldCheck, Sparkles, AlertCircle, CheckCircle, Clock, UserCheck, UserX, MessageSquare } from 'lucide-react';

export default function HeaderProfileBanner({ metrics, orderCount, onRefresh, userRole, setUserRole, pendingNotificationCount, onOpenNotificationModal }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="bg-[#0b1329] border border-slate-700/50 rounded-2xl p-6 shadow-card-dark flex flex-col lg:flex-row items-stretch justify-between gap-6 relative">
      {/* Left: Brand & System Header */}
      <div className="flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              MND <span className="text-cyan-400 font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/50">EDGEPLAN-AI REBORN</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Enterprise Production Planning & AI Agent Optimization Platform (Java Spring Boot + React)
          </p>
        </div>

        {/* Metric Counter Cards inside banner */}
        <div className="flex items-center gap-3 pt-1">
          <div className="bg-[#101935] border border-slate-700/60 rounded-xl px-4 py-2 flex flex-col justify-center min-w-[150px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Çizelgelenen İş Emirleri</span>
            <div className="text-base font-extrabold text-white mt-0.5">
              <span className="text-cyan-400">{orderCount || 4} / {orderCount || 4}</span> <span className="text-xs font-normal text-slate-400">(%100)</span>
            </div>
          </div>

          <div className="bg-[#101935] border border-slate-700/60 rounded-xl px-4 py-2 flex flex-col justify-center min-w-[150px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">FABRİKA VERİMLİLİK İNDEKSİ</span>
            <div className="text-base font-extrabold text-white mt-0.5 flex items-baseline gap-1">
              <span className="text-emerald-400">%{metrics.totalMachineUtilizationPct || 98}</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: User Profile, Role Switcher & Actions */}
      <div className="flex flex-col justify-between items-end gap-4">
        {/* User Card with Role Switcher */}
        <div className="bg-[#101935] border border-slate-700/60 rounded-xl p-3 px-4 flex items-center justify-between gap-4 min-w-[320px]">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm ${
              userRole === 'YÖNETİCİ' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {userRole === 'YÖNETİCİ' ? 'O' : 'OP'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {userRole === 'YÖNETİCİ' ? 'Onur Keskin (Planlama Müdürü)' : 'Saha Operatörü (Üretim Yetkilisi)'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {userRole === 'YÖNETİCİ' ? 'onur.keskin@mnd.com.tr | MND-PLN-042' : 'operator@mnd.com.tr | MND-OP-108'}
              </p>
            </div>
          </div>

          {/* Interactive Role Switcher Toggle */}
          <button
            onClick={() => setUserRole(userRole === 'YÖNETİCİ' ? 'OPERATÖR' : 'YÖNETİCİ')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              userRole === 'YÖNETİCİ'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                : 'bg-blue-950 text-blue-300 border-blue-500/50 hover:bg-blue-900'
            }`}
            title="Kullanıcı rolünü değiştir"
          >
            {userRole === 'YÖNETİCİ' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
            <span>{userRole === 'YÖNETİCİ' ? '👑 Yönetici Modu' : '👷 Operatör Modu'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative flex-wrap justify-end">
          <button
            onClick={() => onOpenNotificationModal && onOpenNotificationModal()}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pendingNotificationCount > 0
                ? 'bg-amber-950 text-amber-300 border-2 border-amber-500 shadow-neon-amber animate-pulse'
                : 'bg-[#101935] text-slate-300 border border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Yönetici Bildirimleri</span>
            {pendingNotificationCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black animate-bounce">
                {pendingNotificationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onRefresh && onRefresh()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yenile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
