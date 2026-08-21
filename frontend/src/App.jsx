import React, { useState, useEffect } from 'react';
import HeaderProfileBanner from './components/HeaderProfileBanner';
import ModuleCard from './components/ModuleCard';
import ModalPopup from './components/ModalPopup';
import MetricCard from './components/MetricCard';
import ChartContainer from './components/ChartContainer';
import OptimizationForm from './components/OptimizationForm';
import AiChatbotPanel from './components/AiChatbotPanel';
import OperationMachineSelector from './components/OperationMachineSelector';
import ScenarioComparisonView from './components/ScenarioComparisonView';
import BreakdownGanttView from './components/BreakdownGanttView';
import ScheduleTable from './components/ScheduleTable';
import NotificationModal from './components/NotificationModal';
import {
  getSystemStatus,
  getResources,
  getOrders,
  getBaselineSchedule,
  runOptimization
} from './services/api';
import {
  Clock,
  Cpu,
  Wrench,
  Layers,
  BarChart3,
  Wand2,
  Play,
  FileText,
  Factory,
  RefreshCw,
  CheckCircle2,
  X,
  Bot,
  Activity,
  TrendingUp,
  Lock,
  Info,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [resources, setResources] = useState([]);
  const [orders, setOrders] = useState([]);
  const [baselineSchedule, setBaselineSchedule] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState(null);

  // Disabled resources (breakdowns) state
  const [disabledResourceIds, setDisabledResourceIds] = useState([]);

  // Role-Based Access Control State ('YÖNETİCİ' vs 'OPERATÖR')
  const [userRole, setUserRole] = useState('YÖNETİCİ');

  // Active Neon Workspace View (0: Çizelgeleme, 1: Makineler, 2: Arıza/Bakım Gantt, 3: İş Emirleri, 4: Senaryo Kıyaslama)
  const [activeModuleView, setActiveModuleView] = useState(0);

  // Chatbot Panel Collapse State
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Active Workspace Container Collapse State
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  // Operator-to-Manager Notifications Stream (Maintained permanently)
  const [operatorNotifications, setOperatorNotifications] = useState([
    {
      id: 1,
      title: '📌 Operatör Önerisi: RES_CNC_01 Bakım Hat Yönlendirmesi',
      details: '5-Eksen CNC tezgahında rutin yağ değişimi nedeniyle işlerin 3-Eksen CNC tezgahına aktarılması önerildi.',
      operatorName: 'Ahmet Yılmaz (Vardiya 1 Operatörü)',
      timestamp: '10 dk önce',
      targetMachine: 'RES_CNC_01',
      status: 'PENDING',
      params: { disabledResourceIds: ['RES_CNC_01'], objectiveType: 'MAKESPAN' }
    }
  ]);

  // Reverse Manager-to-Operator Feedback Stream
  const [operatorFeedbackList, setOperatorFeedbackList] = useState([
    {
      id: 101,
      title: '👑 Yönetici Kararı: WO-2026-001 Acil Sıra Onayı',
      details: 'Planlama Müdürü Onur Keskin sunduğunuz acil sipariş talebini onayladı ve fabrikanın ana planı olarak devreye aldı.',
      managerName: 'Onur Keskin (Planlama Müdürü)',
      timestamp: '25 dk önce',
      decision: 'APPROVED'
    }
  ]);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Global Toast Feedback State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusRes = await getSystemStatus();
      setBackendStatus(statusRes);

      const resRes = await getResources();
      setResources(resRes);

      const ordRes = await getOrders();
      setOrders(ordRes);

      const baseRes = await getBaselineSchedule();
      setBaselineSchedule(baseRes);
      if (!currentSchedule) {
        setCurrentSchedule(baseRes);
      }
      setError(null);
    } catch (err) {
      console.error('Backend connection error:', err);
      setError('Spring Boot backend sunucusu başlatılıyor... Lütfen bekleyin.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      if (!backendStatus) {
        fetchData();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [backendStatus]);

  const handleOptimizationSubmit = async (params, instructionText = '') => {
    if (userRole !== 'YÖNETİCİ') {
      handleSendOperatorNotification({
        title: '📌 Operatör AI Talep Önerisi',
        details: instructionText || 'Operatör tarafından yapay zekaya girilen optimizasyon talebi onayınıza sunuldu.',
        targetMachine: 'Genel Hat',
        params: params
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await runOptimization(params, instructionText);
      setCurrentSchedule(result);

      const ms = result?.metrics?.makespanHours || 38.0;
      const tSec = result?.metrics?.solverSolveTimeSeconds || 0.01;
      showToast(`[OPTİMİZASYON TAMAMLANDI] Makespan: ${ms} Saat | Çözüm Süresi: ${tSec} Saniye`);
    } catch (err) {
      console.error('Optimization execution error:', err);
      alert('Optimizasyon çalıştırılırken bir hata oluştu: ' + (err.message || err));
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRunCustomScenario = async (params) => {
    setIsOptimizing(true);
    try {
      const result = await runOptimization(params);
      setCurrentSchedule(result);
      const ms = result?.metrics?.makespanHours || 38.0;
      showToast(`[ÖZEL SENARYO SIMÜLE EDİLDİ] Makespan: ${ms} Sa | Ortalama Verim: %${result?.metrics?.totalMachineUtilizationPct}`);
    } catch (err) {
      console.error('Run custom scenario error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Operator sends recommendation notification to Manager
  const handleSendOperatorNotification = (notifData) => {
    const newNotif = {
      id: Date.now(),
      title: notifData.title || '📌 Operatör Özel Senaryo Önerisi',
      details: notifData.details || 'Saha operatörü tarafından hazırlanan simülasyon onayınıza sunulmuştur.',
      operatorName: 'Saha Operatörü (MND-OP-108)',
      timestamp: 'Az önce',
      targetMachine: notifData.targetMachine || 'Genel Fabrika',
      status: 'PENDING',
      params: notifData.params || { objectiveType: 'MAKESPAN' }
    };

    setOperatorNotifications(prev => [newNotif, ...prev]);
    showToast(`[BİLDİRİM İLETİLDİ] Talebiniz Yönetici Onay Kuyruğuna İletildi!`);
  };

  // Manager Approves Notification & Sends Reverse Feedback to Operator!
  const handleApproveNotification = async (notif) => {
    setIsOptimizing(true);
    try {
      const result = await runOptimization(notif.params || { objectiveType: 'MAKESPAN' });
      setCurrentSchedule(result);

      // 1. Mark Manager Notification as Approved (Keep in history)
      setOperatorNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, status: 'APPROVED' } : n)
      );

      // 2. Add Reverse Feedback Notification for Operator
      const feedbackMsg = {
        id: Date.now(),
        title: `👑 Yönetici Kararı: ONAYLANDI`,
        details: `Planlama Müdürü Onur Keskin, "${notif.title}" önerinizi ONAYLADI ve fabrikanın ana planı olarak yürürlüğe koydu.`,
        managerName: 'Onur Keskin (Planlama Müdürü)',
        timestamp: 'Az önce',
        decision: 'APPROVED'
      };
      setOperatorFeedbackList(prev => [feedbackMsg, ...prev]);

      showToast(`[YÖNETİCİ ONAYLADI] Operatör önerisi kabul edildi. Operatör ekranına onay bildirimi gönderildi!`);
      setActiveModuleView(0); // View main schedule
      setIsNotificationModalOpen(false);
    } catch (err) {
      console.error('Approve notification error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Manager Rejects Notification & Sends Reverse Feedback to Operator!
  const handleRejectNotification = (id) => {
    const targetNotif = operatorNotifications.find(n => n.id === id);

    setOperatorNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, status: 'REJECTED' } : n)
    );

    // Send Reverse Feedback to Operator
    const feedbackMsg = {
      id: Date.now(),
      title: `👑 Yönetici Kararı: REDDEDİLDİ`,
      details: `Planlama Müdürü Onur Keskin, "${targetNotif?.title || 'Öneri'}" talebinizi inceledi ve şu anki hat koşulları nedeniyle uygun bulmadı.`,
      managerName: 'Onur Keskin (Planlama Müdürü)',
      timestamp: 'Az önce',
      decision: 'REJECTED'
    };
    setOperatorFeedbackList(prev => [feedbackMsg, ...prev]);

    showToast(`[BİLDİRİM REDDEDİLDİ] Operatör ekranına red gerekçesi iletildi.`);
  };

  const handleApplyScenarioAsMainPlan = async (preset) => {
    if (userRole !== 'YÖNETİCİ') {
      handleSendOperatorNotification({
        title: `📌 Operatör Senaryo Önerisi: ${preset.title}`,
        details: `Operatör tarafından beğenilen ve ana plan yapılması istenen senaryo.`,
        targetMachine: 'Fabrika Geneli',
        params: { objectiveType: 'MAKESPAN' }
      });
      return;
    }

    showToast(`[ANA PLAN UYGULANDI] ${preset.title} fabrikanın ana üretim planı olarak kabul edildi!`);
    setActiveModuleView(0); // Return to main schedule view
  };

  const handleToggleResourceBreakdown = async (resourceId) => {
    if (userRole !== 'YÖNETİCİ') {
      handleSendOperatorNotification({
        title: `🔴 Operatör Tezgah Arıza Bildirimi: ${resourceId}`,
        details: `${resourceId} tezgahında fiziki duruş tespit edildi. Hattın yeniden çizelgelenmesi öneriliyor.`,
        targetMachine: resourceId,
        params: { disabledResourceIds: [resourceId], objectiveType: 'MAKESPAN' }
      });
      return;
    }

    let updatedDisabled = [...disabledResourceIds];
    if (updatedDisabled.includes(resourceId)) {
      updatedDisabled = updatedDisabled.filter(id => id !== resourceId);
    } else {
      updatedDisabled.push(resourceId);
    }

    setDisabledResourceIds(updatedDisabled);
    setIsOptimizing(true);

    try {
      const params = {
        objectiveType: 'MAKESPAN',
        disabledResourceIds: updatedDisabled
      };
      const result = await runOptimization(params);
      setCurrentSchedule(result);

      const statusText = updatedDisabled.includes(resourceId) ? 'ARIZALI İLAN EDİLDİ' : 'TEKRAR DEVREYE ALINDI';
      showToast(`[TEZGAH DURUMU] ${resourceId} ${statusText}. Makespan: ${result?.metrics?.makespanHours} Sa.`);
    } catch (err) {
      console.error('Toggle breakdown error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyMachineSelection = async (operationId, preferredResourceId) => {
    if (userRole !== 'YÖNETİCİ') {
      handleSendOperatorNotification({
        title: `⚙️ Operatör Atama Önerisi: ${operationId} -> ${preferredResourceId}`,
        details: `${operationId} operasyonunun ${preferredResourceId} tezgahında işlenmesi önerildi.`,
        targetMachine: preferredResourceId,
        params: { machinePreferences: { [operationId]: preferredResourceId } }
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const params = {
        objectiveType: 'MAKESPAN',
        machinePreferences: { [operationId]: preferredResourceId }
      };
      const result = await runOptimization(params);
      setCurrentSchedule(result);
      setActiveModuleView(4); // Switch to Scenario Comparison View

      const ms = result?.metrics?.makespanHours || 38.0;
      showToast(`[SEÇİM UYGULANDI] ${operationId} -> ${preferredResourceId} ataması yapıldı. Makespan: ${ms} Sa.`);
    } catch (err) {
      console.error('Machine selection optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLoadSampleData = async () => {
    if (userRole !== 'YÖNETİCİ') {
      alert('Veri sıfırlama işlemi için YÖNETİCİ (Planlama Müdürü) yetkisi gereklidir!');
      return;
    }

    setIsOptimizing(true);
    setDisabledResourceIds([]);
    try {
      const baseRes = await getBaselineSchedule();
      setBaselineSchedule(baseRes);
      setCurrentSchedule(baseRes);
      showToast('[VERİ YÜKLENDİ] Fabrika baz verileri yüklendi (6 Makine, 4 İş Emri, 17 Operasyon).');
    } catch (err) {
      console.error('Load sample data error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const metrics = currentSchedule?.metrics || {};
  const tasks = currentSchedule?.tasks || [];
  const deltas = currentSchedule?.deltas || null;
  const pendingNotificationCount = operatorNotifications.filter(n => n.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto relative">
      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e1726] border-2 border-emerald-500 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-card-dark flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Operator to Manager Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={operatorNotifications}
        onApproveNotification={handleApproveNotification}
        onRejectNotification={handleRejectNotification}
      />

      {/* 1. Top Profile Header Banner with Role Switcher & Notification Bell */}
      <HeaderProfileBanner
        metrics={metrics}
        orderCount={orders?.length || 4}
        tasks={tasks}
        resources={resources}
        userRole={userRole}
        setUserRole={setUserRole}
        pendingNotificationCount={pendingNotificationCount}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        onRefresh={() => {
          fetchData();
          showToast('[CANLI BAĞLANTI] Servisler ve veriler yenilendi.');
        }}
      />

      {/* OPERATOR FEEDBACK NOTIFICATION BANNER (Visible in Operatör Mode) */}
      {userRole === 'OPERATÖR' && operatorFeedbackList.length > 0 && (
        <div className="bg-[#0e1726] border-2 border-blue-500/50 rounded-2xl p-4 space-y-2.5 shadow-card-dark animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-blue-300 text-xs flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              Yöneticiden Gelen Son Onay / Karar Bildirimleri ({operatorFeedbackList.length}):
            </span>
            <span className="text-[10px] text-slate-400">Canlı Senkronize</span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto">
            {operatorFeedbackList.map((fb) => (
              <div key={fb.id} className="p-3 rounded-xl bg-[#070c18] border border-blue-500/30 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <h5 className="font-bold text-white flex items-center gap-1.5">
                    {fb.title}
                    <span className="text-[10px] font-mono text-slate-400">({fb.timestamp})</span>
                  </h5>
                  <p className="text-slate-300 text-[11px] leading-snug">{fb.details}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border shrink-0 ${
                  fb.decision === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-red-950 text-red-300 border-red-500/40'
                }`}>
                  {fb.decision === 'APPROVED' ? '✓ ANA PLAN YAPILDI' : '❌ REDDEDİLDİ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backend Connection Alert */}
      {error && !backendStatus && (
        <div className="bg-amber-950/80 border border-amber-500/50 text-amber-200 p-4 rounded-2xl flex items-center justify-between text-sm shadow-card-dark animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer">
            Bağlantıyı Yenile
          </button>
        </div>
      )}

      {/* 2. UNIFIED AI Executive Assistant & Chatbot Panel (Fully Collapsible) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center gap-2.5 text-xs font-bold px-4 py-2.5 bg-[#0e1726] border border-cyan-500/50 text-cyan-300 rounded-xl hover:bg-[#121e36] hover:border-cyan-400 transition-all cursor-pointer shadow-neon-cyan"
          >
            <Bot className="w-4.5 h-4.5 text-cyan-400" />
            <span>MND AI Yapay Zeka Danışmanı & Chatbot Paneli</span>
            <span className="flex items-center gap-1 text-[11px] text-cyan-300 font-semibold px-2 py-0.5 bg-cyan-950/80 rounded-md border border-cyan-500/30 ml-2">
              {isChatOpen ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Paneli Gizle ▲</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Paneli Göster (Tıklayın) ▼</span>
                </>
              )}
            </span>
          </button>

          {!isChatOpen && (
            <span className="text-xs text-slate-400 italic">
              (AI Paneli gizlendi — Ekran alanınız makine grafiklerine ve Gantt şemalarına ayrıldı)
            </span>
          )}
        </div>

        {isChatOpen && (
          <AiChatbotPanel
            onApplySuggestedRequest={(suggestedReq, textInstruction) => handleOptimizationSubmit(suggestedReq, textInstruction)}
            isOptimizing={isOptimizing}
            userRole={userRole}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>

      {/* 3. Direct 5 Neon Module Cards Navigation Bar */}
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Akıllı Optimizasyon Parkı Modülleri
        </h2>
        <p className="text-xs text-slate-400">
          Görüntülemek istediğiniz modül kartına tıklayarak alt çalışma alanındaki görünümü anında değiştirebilirsiniz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-2 items-start">
          <div onClick={() => { setActiveModuleView(0); setIsWorkspaceOpen(true); }} className="cursor-pointer">
            <ModuleCard
              title="Üretim Çizelgeleme"
              subtitle="Gantt Şeması & Operasyon Tablosu"
              icon={Clock}
              colorTheme="blue"
              badgeText="4 Operasyon"
              scoreText={`Makespan: ${metrics.makespanHours || 38} Sa`}
              isActive={activeModuleView === 0}
              onExpand={() => { setActiveModuleView(0); setIsWorkspaceOpen(true); }}
            />
          </div>

          <div onClick={() => { setActiveModuleView(1); setIsWorkspaceOpen(true); }} className="cursor-pointer">
            <ModuleCard
              title="Makine Yük Dağılımı"
              subtitle="Tezgah Parkı Kapasiteleri & Bar Grafikleri"
              icon={Cpu}
              colorTheme="emerald"
              badgeText={`${resources?.length || 6} Makine`}
              scoreText={`%${metrics.totalMachineUtilizationPct || 98} Verim`}
              isActive={activeModuleView === 1}
              onExpand={() => { setActiveModuleView(1); setIsWorkspaceOpen(true); }}
            />
          </div>

          <div onClick={() => { setActiveModuleView(2); setIsWorkspaceOpen(true); }} className="cursor-pointer">
            <ModuleCard
              title="Arıza & Bakım"
              subtitle="Renkli Gantt Şeması & Arıza Yönetimi"
              icon={Wrench}
              colorTheme="purple"
              badgeText="Bakım Gantt"
              scoreText="Korumalı Hat"
              isActive={activeModuleView === 2}
              onExpand={() => { setActiveModuleView(2); setIsWorkspaceOpen(true); }}
            />
          </div>

          <div onClick={() => { setActiveModuleView(3); setIsWorkspaceOpen(true); }} className="cursor-pointer">
            <ModuleCard
              title="İş Emri Portföyü"
              subtitle="ERP Sipariş Kartları & Öncelikler"
              icon={Layers}
              colorTheme="cyan"
              badgeText={`${orders?.length || 4} İş Emri`}
              scoreText="Senkronize"
              isActive={activeModuleView === 3}
              onExpand={() => { setActiveModuleView(3); setIsWorkspaceOpen(true); }}
            />
          </div>

          <div onClick={() => { setActiveModuleView(4); setIsWorkspaceOpen(true); }} className="cursor-pointer">
            <ModuleCard
              title="Senaryo Kıyaslama"
              subtitle="Yan Yana Baz vs Simülasyon Kıyaslaması"
              icon={TrendingUp}
              colorTheme="amber"
              badgeText={`${metrics.tardyOrderCount || 0} Gecikme`}
              scoreText="Kıyaslama Hazır"
              isActive={activeModuleView === 4}
              onExpand={() => { setActiveModuleView(4); setIsWorkspaceOpen(true); }}
            />
          </div>
        </div>
      </div>

      {/* 4. Active Workspace Container */}
      <div className="bg-[#0b1329] border border-cyan-500/50 rounded-2xl p-6 shadow-card-dark space-y-6 animate-fade-in mt-4">
        {/* Workspace Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                {activeModuleView === 0 && 'Üretim Çizelgeleme & Gantt Şeması Alanı'}
                {activeModuleView === 1 && 'Makine Yük Dağılımı & Kapasite Parkı'}
                {activeModuleView === 2 && 'Makine Arıza & Bakım Durum Gantt Şeması'}
                {activeModuleView === 3 && 'Aktif İş Emirleri & ERP Portföyü'}
                {activeModuleView === 4 && 'Serbest Senaryo Yapılandırıcı & Özgür Kıyaslama'}
              </h3>

              {/* Dedicated Workspace Toggle / Hide Button */}
              <button
                onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#070c18] hover:bg-[#121e36] text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                {isWorkspaceOpen ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bu Alanı Gizle ▲</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bu Alanı Göster (Tıklayın) ▼</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              OR-Tools İş Çizelgeleme Modeli — Öncelik Kuralları, Makine Kapasiteleri & Teslim Zamanı Kısıtları
            </p>
          </div>

          {/* Action Buttons with Role-Based Lock */}
          {isWorkspaceOpen && (
            <div className="flex items-center gap-3">
              {userRole === 'YÖNETİCİ' ? (
                <>
                  <button
                    onClick={handleLoadSampleData}
                    disabled={isOptimizing}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    Örnek Veri Yükle
                  </button>

                  <button
                    onClick={() => handleOptimizationSubmit({ objectiveType: 'MAKESPAN' })}
                    disabled={isOptimizing}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-neon-emerald cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isOptimizing ? 'Hesaplanıyor...' : 'Optimizasyonu Çalıştır'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleSendOperatorNotification({
                    title: '📌 Operatör Manuel Optimizasyon Talebi',
                    details: 'Saha operatörü tarafından genel üretim çizelgesinin yeniden hesaplanması istendi.',
                    targetMachine: 'Tüm Fabrika',
                    params: { objectiveType: 'MAKESPAN' }
                  })}
                  className="text-xs font-bold px-4 py-2.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>📌 Optimizasyon Talebini Yöneticiye İlet</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Collapsed Alert Bar */}
        {!isWorkspaceOpen && (
          <div className="p-4 rounded-xl bg-[#070c18] border border-cyan-500/30 text-slate-300 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>
                <strong>Çalışma Alanı Gizlendi:</strong> Grafik ve tablolar gizlenmiş durumdadır. Görmek için yukarıdaki <strong>"Bu Alanı Göster"</strong> butonuna veya modül kartlarına tıklayabilirsiniz.
              </span>
            </div>
            <button
              onClick={() => setIsWorkspaceOpen(true)}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer shadow-neon-cyan"
            >
              Alanı Göster ▼
            </button>
          </div>
        )}

        {/* Dynamic View Display Area (Hidden when isWorkspaceOpen is false) */}
        {isWorkspaceOpen && (
          <>
            {isLoading && !currentSchedule ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-950 border-t-emerald-400 rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-slate-400">Veriler Yükleniyor & Optimizasyon Hesaplanıyor...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* VIEW 0: Üretim Çizelgeleme */}
                {activeModuleView === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      <MetricCard title="Toplam Makespan (Süre)" value={metrics.makespanHours || 38} unit="Saat" subtitle="Tüm operasyonların bitiş zamanı" type="makespan" deltaStr={deltas?.metricsDelta?.makespanDeltaStr} />
                      <MetricCard title="Geciken Sipariş Sayısı" value={metrics.tardyOrderCount || 0} unit="Adet" subtitle={`Toplam ${metrics.totalTardinessHours || 0} Sa gecikme`} type="tardy" deltaStr={deltas?.metricsDelta?.tardyDeltaStr} />
                      <MetricCard title="Makine Verimlilik Oranı" value={`%${metrics.totalMachineUtilizationPct || 98}`} subtitle="Ortalama makine doluluk oranı" type="utilization" deltaStr={deltas?.metricsDelta?.utilDeltaStr} />
                      <MetricCard title="Çözücü Hesaplama Süresi" value={metrics.solverSolveTimeSeconds || 0.05} unit="Saniye" subtitle={`${metrics.scheduledTaskCount || tasks.length || 17} Operasyon Çözüldü`} type="tasks" />
                    </div>
                    <ChartContainer tasks={tasks} />
                    <ScheduleTable tasks={tasks} />
                  </div>
                )}

                {/* VIEW 1: Makine Yük Dağılımı */}
                {activeModuleView === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-3.5 rounded-xl bg-[#0e1726] border border-emerald-500/30 text-slate-300 text-xs flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Tekil Makine Doluluk Oranı HESAPLAMA METODU:</strong> Doluluk Oranı (%) = (Tek Makinede Çalışan Operasyonların Toplam Saati / Planlama Ufku Makespan (38 Sa)) × 100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {resources.map((res) => {
                        const resTasks = tasks.filter(t => t.resourceId === res.resourceId);
                        const rawHours = resTasks.reduce((sum, t) => sum + (t.endHour - t.startHour), 0);
                        const resHours = Math.round(rawHours * 10) / 10;
                        const totalMs = 38.0;
                        const utilPct = Math.min(100, Math.round((resHours / totalMs) * 100 * 10) / 10);
                        const oeeSpeed = Math.round((res.efficiencyFactor || 1.0) * 100);

                        return (
                          <div key={res.resourceId} className="bg-[#0e1726] p-5 rounded-2xl border border-emerald-500/40 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-500/30">
                                <Factory className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-extrabold px-3 py-1 bg-emerald-950 text-emerald-300 rounded-lg border border-emerald-500/40">
                                %{utilPct} Doluluk
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base">{res.name}</h4>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{res.resourceId}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                              <div className="flex justify-between">
                                <span>Çalışma Süresi:</span>
                                <strong className="text-cyan-300 font-mono">{resHours} Saat / 38 Sa</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>OEE Hız Performansı:</span>
                                <strong className="text-emerald-400">%{oeeSpeed} Hız Katsayısı</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Birim Maliyet:</span>
                                <strong>${res.costPerHour}/Sa</strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <ChartContainer tasks={tasks} />
                  </div>
                )}

                {/* VIEW 2: Arıza & Bakım Gantt Şeması */}
                {activeModuleView === 2 && (
                  <div className="animate-fade-in">
                    <BreakdownGanttView
                      resources={resources}
                      tasks={tasks}
                      disabledResourceIds={disabledResourceIds}
                      onToggleResourceBreakdown={handleToggleResourceBreakdown}
                    />
                  </div>
                )}

                {/* VIEW 3: İş Emri Portföyü */}
                {activeModuleView === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {orders.map((ord) => (
                        <div key={ord.orderId} className="bg-[#0e1726] p-5 rounded-2xl border border-cyan-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Layers className="w-5 h-5 text-cyan-400" />
                              <h4 className="font-bold text-white">{ord.orderId}</h4>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                              ord.priority === 3 ? 'bg-red-950 text-red-300 border-red-500/40' : 'bg-blue-950 text-blue-300 border-blue-500/40'
                            }`}>
                              {ord.priority === 3 ? 'Acil (Priority 3)' : `Priority ${ord.priority}`}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-300">Ürün Ailesi: {ord.productFamily}</p>
                          <div className="text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                            <span>Teslim Hedefi: {ord.dueDateHour} Sa</span>
                            <span>{ord.operationIds?.length || 0} Operasyon</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <ScheduleTable tasks={tasks} />
                  </div>
                )}

                {/* VIEW 4: Serbest Senaryo Yapılandırıcı & Özgür Kıyaslama */}
                {activeModuleView === 4 && (
                  <div className="animate-fade-in">
                    <ScenarioComparisonView
                      baselineSchedule={baselineSchedule}
                      currentSchedule={currentSchedule}
                      deltas={deltas}
                      metrics={metrics}
                      tasks={tasks}
                      resources={resources}
                      orders={orders}
                      userRole={userRole}
                      onRunCustomScenario={handleRunCustomScenario}
                      onApplyScenarioAsMainPlan={handleApplyScenarioAsMainPlan}
                      onSendOperatorNotification={handleSendOperatorNotification}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
