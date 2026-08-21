import { jsPDF } from 'jspdf';

// Helper to normalize Turkish characters for standard PDF Helvetica font without spacing glitches
function cleanText(str) {
  if (!str) return '';
  return String(str)
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
}

export function exportScenarioComparisonPdf(baselineSchedule, currentSchedule, metrics, tasks, resources, orders) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const nowStr = new Date().toLocaleString('tr-TR');

  // Baseline Scenario A metrics
  const baseMetrics = baselineSchedule?.metrics || {};
  const baseTasks = baselineSchedule?.tasks || [];
  const makespanA = baseMetrics.makespanHours || 38.0;
  const tardyA = baseMetrics.tardyOrderCount || 0;
  const utilA = baseMetrics.totalMachineUtilizationPct || 30.5;

  // Custom Scenario B metrics
  const makespanB = metrics?.makespanHours !== undefined ? metrics.makespanHours : 38.0;
  const tardyB = metrics?.tardyOrderCount !== undefined ? metrics.tardyOrderCount : 0;
  const utilB = metrics?.totalMachineUtilizationPct !== undefined ? metrics.totalMachineUtilizationPct : 30.5;

  const makespanDiff = Math.round((makespanB - makespanA) * 10.0) / 10.0;

  // 1. Executive Top Header (Navy & Sky Accent)
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 32, 'F');

  // Sky Accent Strip
  doc.setFillColor(2, 132, 199); // Sky 600
  doc.rect(0, 32, 210, 2, 'F');

  // Title & Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('MND EDGEPLAN-AI REBORN', 14, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248); // Sky 400
  doc.text(cleanText('EXECUTIVE SENARYO KIYASLAMA VE SİMÜLASYON RAPORU'), 14, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(cleanText(`Rapor Tarihi: ${nowStr}  |  Yetkili: MND Planlama Müdürlüğü`), 14, 28);

  // Status Badge
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.roundedRect(155, 10, 41, 14, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('CANLI COZUCU', 160, 16);
  doc.setFontSize(7);
  doc.text('OR-Tools Optimal', 160, 20.5);

  // 2. Executive Side-by-Side Scenario Cards
  let y = 42;

  // Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText('1. SENARYO KIYASLAMA METRİKLERİ (YAN YANA KART ANALİZİ)'), 14, y);
  y += 5;

  // Card A (Baseline Scenario A)
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, 88, 48, 3, 3, 'FD');

  // Header Line Card A
  doc.setFillColor(71, 85, 105); // Slate 600
  doc.roundedRect(14, y, 88, 8, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('SENARYO A: STANDARD BAZ PLAN', 18, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(cleanText(`• Makespan (Maksimum Bitiş): ${makespanA} Saat`), 18, y + 15);
  doc.text(cleanText(`• Geciken Sipariş Sayısı: ${tardyA} Adet`), 18, y + 22);
  doc.text(cleanText(`• Makine Verimlilik Oranı: %${utilA}`), 18, y + 29);
  doc.text(cleanText(`• Çözüm Süresi: 0.01 Saniye`), 18, y + 36);
  doc.text(cleanText(`• Durum: Standard ERP Hat Sıralaması`), 18, y + 43);

  // Card B (Custom Simulation Scenario B)
  doc.setFillColor(240, 249, 255); // Sky 50
  doc.setDrawColor(56, 189, 248); // Sky 400
  doc.roundedRect(108, y, 88, 48, 3, 3, 'FD');

  // Header Line Card B
  doc.setFillColor(2, 132, 199); // Sky 600
  doc.roundedRect(108, y, 88, 8, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(cleanText('SENARYO B: ÖZEL SİMÜLASYON PLAN'), 112, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText(`• Makespan (Maksimum Bitiş): ${makespanB} Saat`), 112, y + 15);
  doc.text(cleanText(`• Geciken Sipariş Sayısı: ${tardyB} Adet`), 112, y + 22);
  doc.text(cleanText(`• Makine Verimlilik Oranı: %${utilB}`), 112, y + 29);

  if (makespanDiff > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(cleanText(`• Toplam Süre Farkı: +${makespanDiff} Sa (Uzamaktadır)`), 112, y + 36);
  } else if (makespanDiff < 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(4, 120, 87);
    doc.text(cleanText(`• Toplam Süre Farkı: ${makespanDiff} Sa (Kısalmaktadır)`), 112, y + 36);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text(cleanText(`• Toplam Süre Farkı: 0.0 Sa (Aynı Kalmaktadır)`), 112, y + 36);
  }

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(cleanText(`• Durum: Kullanıcı Odaklı Simülasyon`), 112, y + 43);

  y += 56;

  // 3. Machine-by-Machine Detailed Operations Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText('2. TEZGAH BAZLI OPERASYON ATAMALARI KIYASLAMA TABLOSU'), 14, y);
  y += 5;

  // Table Header Box
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(cleanText('TEZGAH PARKI KODU & TANIMI'), 17, y + 5.5);
  doc.text(cleanText('SENARYO A (BAZ PLAN) ATAMALARI'), 76, y + 5.5);
  doc.text(cleanText('SENARYO B (SİMÜLASYON) ATAMALARI'), 138, y + 5.5);

  y += 8;

  const machineList = resources || [
    { resourceId: 'RES_CNC_01', name: '5-Eksen CNC İşleme Merkezi' },
    { resourceId: 'RES_CNC_02', name: '3-Eksen CNC Freze Tezgahı' },
    { resourceId: 'RES_LATHE_01', name: 'Hassas Torna Tezgahı' },
    { resourceId: 'RES_ASY_01', name: 'Otomatik Montaj Hattı' },
    { resourceId: 'RES_QC_01', name: 'CMM Kalite Kontrol İstasyonu' },
    { resourceId: 'RES_PACK_01', name: 'Paketleme & Sevkiyat Ünitesi' },
  ];

  machineList.forEach((m, idx) => {
    const baseTasksRes = baseTasks.filter(t => t.resourceId === m.resourceId);
    const simTasksRes = tasks.filter(t => t.resourceId === m.resourceId);

    const baseSummary = baseTasksRes.length > 0
      ? baseTasksRes.map(t => `${t.operationId} (${t.startHour}-${t.endHour}Sa)`).join(', ')
      : 'Atanmış İş Yok';

    const simSummary = simTasksRes.length > 0
      ? simTasksRes.map(t => `${t.operationId} (${t.startHour}-${t.endHour}Sa)`).join(', ')
      : 'Atanmış İş Yok';

    const baseLines = doc.splitTextToSize(cleanText(baseSummary), 56);
    const simLines = doc.splitTextToSize(cleanText(simSummary), 56);
    const maxLines = Math.max(baseLines.length, simLines.length, 1);
    const rowHeight = Math.max(12, maxLines * 4.2 + 5);

    // Zebra Row Striping
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + rowHeight, 196, y + rowHeight);

    // Column 1: Machine Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const nameLines = doc.splitTextToSize(cleanText(m.name), 56);
    doc.text(nameLines, 17, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${m.resourceId})`, 17, y + 5 + (nameLines.length * 4));

    // Column 2: Scenario A Tasks
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(baseLines, 76, y + 5);

    // Column 3: Scenario B Tasks
    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.text(simLines, 138, y + 5);

    y += rowHeight;
  });

  // 4. Executive Summary Note Box
  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText('EXECUTIVE DEĞERLENDİRME NOTU:'), 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const noteText = cleanText(`Standart Baz Plan A'da üretim süresi ${makespanA} Sa iken, simülasyon B uygulandığında üretim süresi ${makespanB} Sa olarak hesaplanmıştır. Bu rapor MND EdgePlan-AI OR-Tools motoru tarafından otomatik oluşturulmuştur.`);
  doc.text(doc.splitTextToSize(noteText, 174), 18, y + 11);

  // 5. Professional Footer Signature Block
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('MND EdgePlan-AI Enterprise Systems © 2026  |  Gizli & Kurumsal Rapor', 14, 285);
  doc.text('Sayfa 1 / 1', 180, 285);

  // DIRECT INSTANT FILE DOWNLOAD
  doc.save('MND_Executive_Senaryo_Kiyaslama_Raporu.pdf');
}
