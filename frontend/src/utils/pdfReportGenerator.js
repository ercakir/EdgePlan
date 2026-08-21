import { jsPDF } from 'jspdf';

export function exportDirectPdfReport(metrics, tasks, resources) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const nowStr = new Date().toLocaleString('tr-TR');
  const makespan = metrics?.makespanHours || 38.0;
  const tardy = metrics?.tardyOrderCount || 0;
  const util = metrics?.totalMachineUtilizationPct || 30.5;

  // 1. Navy Header Banner Box
  doc.setFillColor(11, 19, 41); // #0b1329
  doc.rect(10, 10, 190, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('MND EDGEPLAN-AI REBORN', 16, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(6, 182, 212); // #06b6d4 Cyan
  doc.text('FABRIKA URETIM CIZELGELENDIRME VE KAPASITE RAPORU', 16, 28);

  // Metadata
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Rapor Tarihi: ${nowStr}  |  Hazirlayan: MND AI Optimization Engine`, 10, 39);

  // 2. KPI Summary Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, 43, 190, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('KPI OZETI:', 15, 51);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Toplam Makespan: ${makespan} Saat   |   Geciken Siparis: ${tardy} Adet   |   Ortalama Doluluk: %${util}`, 15, 57);

  // 3. Section 1: Single Machine Utilization Table (%)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 19, 41);
  doc.text('1. TEKIL MAKINE DOLULUK ORANLARI (%) - [38 SAAT LİMİTLİ]', 10, 69);

  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.line(10, 71, 200, 71);

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(10, 74, 190, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Makine Kodu & Tanimi', 14, 78.5);
  doc.text('Calisma Süresi (Saat)', 100, 78.5);
  doc.text('Doluluk Orani (%)', 150, 78.5);

  const machineList = resources || [
    { resourceId: 'RES_CNC_01', name: '5-Eksen CNC Isleme Merkezi' },
    { resourceId: 'RES_CNC_02', name: '3-Eksen CNC Freze Tezgah' },
    { resourceId: 'RES_LATHE_01', name: 'Hassas Torna Tezgah' },
    { resourceId: 'RES_ASY_01', name: 'Otomatik Montaj Hatti' },
    { resourceId: 'RES_QC_01', name: 'CMM Kalite Kontrol Istasyonu' },
    { resourceId: 'RES_PACK_01', name: 'Paketleme & Sevkiyat Unitesi' },
  ];

  let y = 86;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  machineList.forEach((m, idx) => {
    const resTasks = (tasks || []).filter(t => t.resourceId === m.resourceId);
    const rawHours = resTasks.reduce((sum, t) => sum + (t.endHour - t.startHour), 0);
    const resHours = Math.round(rawHours * 10) / 10;
    const utilPct = Math.min(100, Math.round((resHours / 38.0) * 100 * 10) / 10);

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 4.5, 190, 6, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.text(`${m.name} (${m.resourceId})`, 14, y);
    doc.text(`${resHours} Sa / 38.0 Sa`, 100, y);

    if (utilPct > 80) doc.setTextColor(217, 119, 6); // Amber
    else doc.setTextColor(16, 185, 129); // Emerald

    doc.text(`%${utilPct} Doluluk`, 150, y);
    y += 6.5;
  });

  // 4. Section 2: Scheduled Operations List
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 19, 41);
  doc.text('2. ATANMIS URETIM OPERASYONLARI CIZELGESI', 10, y);
  doc.line(10, y + 2, 200, y + 2);
  y += 7;

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(10, y, 190, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Is Emri ID', 14, y + 4.5);
  doc.text('Operasyon Adi', 45, y + 4.5);
  doc.text('Atanan Makine', 110, y + 4.5);
  doc.text('Zaman Araligi (Saat)', 160, y + 4.5);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const sortedTasks = [...(tasks || [])].sort((a, b) => a.startHour - b.startHour);

  sortedTasks.slice(0, 15).forEach((t, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y - 4, 190, 5.5, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.text(t.orderId || 'WO-2026', 14, y);
    doc.text(t.operationName || t.operationId, 45, y);
    doc.text(t.resourceName || t.resourceId, 110, y);
    doc.text(`${t.startHour} Sa - ${t.endHour} Sa`, 160, y);

    y += 6;
    if (y > 270) return;
  });

  // Footer Note
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('MND EDGEPLAN-AI REBORN © 2026 — Bu rapor OR-Tools optimizasyon motoru tarafindan uretilmistir.', 10, 285);

  // DIRECT INSTANT FILE DOWNLOAD (Zero print dialog)
  doc.save('MND_EdgePlan_Uretim_Raporu_2026.pdf');
}
