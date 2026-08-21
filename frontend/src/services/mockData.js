// Client-side Mock & Simulation Engine for GitHub Pages Live Demo Mode

export const mockResources = [
  { resourceId: 'RES_CNC_01', name: '5-Eksen CNC İşleme Merkezi', capacity: 1.0, efficiencyFactor: 1.1, costPerHour: 150.0, active: true },
  { resourceId: 'RES_CNC_02', name: '3-Eksen CNC Freze', capacity: 1.0, efficiencyFactor: 0.95, costPerHour: 120.0, active: true },
  { resourceId: 'RES_LATHE_01', name: 'Hassas Torna Tezgahı', capacity: 1.0, efficiencyFactor: 1.0, costPerHour: 100.0, active: true },
  { resourceId: 'RES_ASY_01', name: 'Otomatik Montaj Hattı', capacity: 1.0, efficiencyFactor: 1.2, costPerHour: 80.0, active: true },
  { resourceId: 'RES_QC_01', name: 'CMM Kalite Kontrol İstasyonu', capacity: 1.0, efficiencyFactor: 1.0, costPerHour: 90.0, active: true },
  { resourceId: 'RES_PACK_01', name: 'Paketleme & Sevkiyat Ünitesi', capacity: 1.0, efficiencyFactor: 1.3, costPerHour: 60.0, active: true }
];

export const mockOrders = [
  {
    orderId: 'WO-2026-001',
    productFamily: 'Türbin Kanatçık Seti',
    priority: 3,
    dueDateHour: 24.0,
    operationIds: ['OP_101', 'OP_102', 'OP_103', 'OP_104']
  },
  {
    orderId: 'WO-2026-002',
    productFamily: 'Hidrolik Silindir Gövdesi',
    priority: 2,
    dueDateHour: 36.0,
    operationIds: ['OP_201', 'OP_202', 'OP_203', 'OP_204']
  },
  {
    orderId: 'WO-2026-003',
    productFamily: 'Endüstriyel Şanzıman Kutusu',
    priority: 1,
    dueDateHour: 48.0,
    operationIds: ['OP_301', 'OP_302', 'OP_303', 'OP_304', 'OP_305']
  },
  {
    orderId: 'WO-2026-004',
    productFamily: 'Elektromekanik Aktüatör',
    priority: 2,
    dueDateHour: 30.0,
    operationIds: ['OP_401', 'OP_402', 'OP_403', 'OP_404']
  }
];

export const mockOperations = {
  OP_101: { operationId: 'OP_101', orderId: 'WO-2026-001', sequenceIndex: 1, name: 'Kaba Talaş Kaldırma', durationHours: 4.0, eligibleResourceIds: ['RES_CNC_01', 'RES_CNC_02'], setupTimeHours: 0.5 },
  OP_102: { operationId: 'OP_102', orderId: 'WO-2026-001', sequenceIndex: 2, name: 'Hassas Yüzey İşleme', durationHours: 6.0, eligibleResourceIds: ['RES_CNC_01'], setupTimeHours: 0.5 },
  OP_103: { operationId: 'OP_103', orderId: 'WO-2026-001', sequenceIndex: 3, name: 'Kalite Kontrol Ölçümü', durationHours: 2.0, eligibleResourceIds: ['RES_QC_01'], setupTimeHours: 0.2 },
  OP_104: { operationId: 'OP_104', orderId: 'WO-2026-001', sequenceIndex: 4, name: 'Son Montaj & Muhafaza', durationHours: 3.0, eligibleResourceIds: ['RES_ASY_01'], setupTimeHours: 0.3 },

  OP_201: { operationId: 'OP_201', orderId: 'WO-2026-002', sequenceIndex: 1, name: 'Torna Çap Tornalama', durationHours: 5.0, eligibleResourceIds: ['RES_LATHE_01'], setupTimeHours: 0.4 },
  OP_202: { operationId: 'OP_202', orderId: 'WO-2026-002', sequenceIndex: 2, name: 'Delik Delme & Borlama', durationHours: 4.0, eligibleResourceIds: ['RES_CNC_02', 'RES_CNC_01'], setupTimeHours: 0.3 },
  OP_203: { operationId: 'OP_203', orderId: 'WO-2026-002', sequenceIndex: 3, name: 'Basınç Sızdırmazlık Testi', durationHours: 3.0, eligibleResourceIds: ['RES_QC_01'], setupTimeHours: 0.2 },
  OP_204: { operationId: 'OP_204', orderId: 'WO-2026-002', sequenceIndex: 4, name: 'Koruyucu Paketleme', durationHours: 2.0, eligibleResourceIds: ['RES_PACK_01'], setupTimeHours: 0.1 },

  OP_301: { operationId: 'OP_301', orderId: 'WO-2026-003', sequenceIndex: 1, name: 'Döküm Gövde Taşlama', durationHours: 6.0, eligibleResourceIds: ['RES_CNC_02'], setupTimeHours: 0.5 },
  OP_302: { operationId: 'OP_302', orderId: 'WO-2026-003', sequenceIndex: 2, name: 'Dişli Açma İşlemi', durationHours: 8.0, eligibleResourceIds: ['RES_CNC_01', 'RES_LATHE_01'], setupTimeHours: 0.8 },
  OP_303: { operationId: 'OP_303', orderId: 'WO-2026-003', sequenceIndex: 3, name: 'Rulman Montajı', durationHours: 4.0, eligibleResourceIds: ['RES_ASY_01'], setupTimeHours: 0.4 },
  OP_304: { operationId: 'OP_304', orderId: 'WO-2026-003', sequenceIndex: 4, name: 'Final Ürün Kalite Testi', durationHours: 2.5, eligibleResourceIds: ['RES_QC_01'], setupTimeHours: 0.2 },
  OP_305: { operationId: 'OP_305', orderId: 'WO-2026-003', sequenceIndex: 5, name: 'Ahşap Sandıklama', durationHours: 2.0, eligibleResourceIds: ['RES_PACK_01'], setupTimeHours: 0.1 },

  OP_401: { operationId: 'OP_401', orderId: 'WO-2026-004', sequenceIndex: 1, name: 'Mil Tornalama', durationHours: 3.5, eligibleResourceIds: ['RES_LATHE_01'], setupTimeHours: 0.3 },
  OP_402: { operationId: 'OP_402', orderId: 'WO-2026-004', sequenceIndex: 2, name: 'Konnektör Yuvası Açma', durationHours: 3.0, eligibleResourceIds: ['RES_CNC_02'], setupTimeHours: 0.3 },
  OP_403: { operationId: 'OP_403', orderId: 'WO-2026-004', sequenceIndex: 3, name: 'Kablolama & Kart Montajı', durationHours: 5.0, eligibleResourceIds: ['RES_ASY_01'], setupTimeHours: 0.5 },
  OP_404: { operationId: 'OP_404', orderId: 'WO-2026-004', sequenceIndex: 4, name: 'Fonksiyonel Test', durationHours: 2.0, eligibleResourceIds: ['RES_QC_01'], setupTimeHours: 0.2 }
};

export function simulateOptimization(params = {}) {
  const disabledResourceIds = params.disabledResourceIds || [];
  const objectiveType = params.objectiveType || 'MAKESPAN';
  const machinePreferences = params.machinePreferences || {};

  const resourceNextAvailable = {
    RES_CNC_01: 0.0,
    RES_CNC_02: 0.0,
    RES_LATHE_01: 0.0,
    RES_ASY_01: 0.0,
    RES_QC_01: 0.0,
    RES_PACK_01: 0.0
  };

  const opEndTimes = {};
  const tasks = [];

  const sortedOrders = [...mockOrders].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.dueDateHour - b.dueDateHour;
  });

  let maxMakespan = 0;
  let tardyCount = 0;
  let totalTardiness = 0;

  for (const order of sortedOrders) {
    let orderEndTime = 0;
    for (const opId of order.operationIds) {
      const op = mockOperations[opId];
      if (!op) continue;

      let eligible = op.eligibleResourceIds.filter(r => !disabledResourceIds.includes(r));
      if (eligible.length === 0) {
        eligible = mockResources.filter(r => !disabledResourceIds.includes(r.resourceId)).map(r => r.resourceId);
      }
      if (eligible.length === 0) eligible = ['RES_CNC_02'];

      let chosenResource = eligible[0];
      if (machinePreferences[opId] && eligible.includes(machinePreferences[opId])) {
        chosenResource = machinePreferences[opId];
      } else {
        let minTime = Infinity;
        for (const resId of eligible) {
          const avail = resourceNextAvailable[resId] || 0;
          if (avail < minTime) {
            minTime = avail;
            chosenResource = resId;
          }
        }
      }

      const seqIndex = op.sequenceIndex;
      let prevOpEnd = 0;
      if (seqIndex > 1) {
        const prevOpId = order.operationIds[seqIndex - 2];
        prevOpEnd = opEndTimes[prevOpId] || 0;
      }

      const resAvail = resourceNextAvailable[chosenResource] || 0;
      let startTime = Math.max(prevOpEnd, resAvail);

      if (chosenResource === 'RES_CNC_01' && startTime < 14 && (startTime + op.durationHours) > 12) {
        startTime = Math.max(startTime, 14.0);
      }

      const endTime = startTime + op.durationHours;
      opEndTimes[opId] = endTime;
      resourceNextAvailable[chosenResource] = endTime;

      if (endTime > orderEndTime) orderEndTime = endTime;
      if (endTime > maxMakespan) maxMakespan = endTime;

      const resObj = mockResources.find(r => r.resourceId === chosenResource);
      const resName = resObj ? resObj.name : chosenResource;

      tasks.push({
        taskId: `TASK_${opId}`,
        workOrderId: order.orderId,
        operationId: opId,
        operationName: op.name,
        assignedResourceId: chosenResource,
        assignedResourceName: resName,
        startHour: Math.round(startTime * 10) / 10,
        endHour: Math.round(endTime * 10) / 10,
        durationHours: op.durationHours,
        tardy: endTime > order.dueDateHour
      });
    }

    if (orderEndTime > order.dueDateHour) {
      tardyCount++;
      totalTardiness += (orderEndTime - order.dueDateHour);
    }
  }

  const makespan = Math.round(maxMakespan * 10) / 10;
  const avgUtil = disabledResourceIds.length > 0 ? 88.5 : 94.2;

  return {
    runType: disabledResourceIds.length > 0 ? 'BREAKDOWN_SIMULATION' : 'BASELINE',
    objectiveType: objectiveType,
    metrics: {
      makespanHours: makespan,
      totalMachineUtilizationPct: avgUtil,
      tardyJobsCount: tardyCount,
      totalTardinessHours: Math.round(totalTardiness * 10) / 10,
      solverSolveTimeSeconds: 0.02
    },
    tasks: tasks,
    deltas: disabledResourceIds.length > 0 ? [
      {
        resourceId: disabledResourceIds[0],
        resourceName: mockResources.find(r => r.resourceId === disabledResourceIds[0])?.name || disabledResourceIds[0],
        oldTaskCount: 3,
        newTaskCount: 0,
        transferredTasksCount: 3,
        utilizationDeltaPct: -94.2,
        impactDescription: `${disabledResourceIds[0]} arızası nedeniyle 3 operasyon alternatif tezgahlara aktarıldı.`
      }
    ] : null
  };
}

export function getMockChatResponse(queryText) {
  const q = (queryText || '').toLowerCase();
  if (q.includes('makespan') || q.includes('bitiş') || q.includes('süresi')) {
    return 'Mevcut fabrika planı Makespan süresi **38.0 Saat** olarak hesaplanmıştır. 4 iş emri (17 operasyon) kısıtlar korunarak dizilmiştir.';
  }
  if (q.includes('arıza') || q.includes('bakım') || q.includes('cnc')) {
    return 'RES_CNC_01 tezgahında arıza simülasyonu yapıldığında, 5-Eksen CNC işleri otomatik olarak RES_CNC_02 tezgahına aktarılır. Makespan %8.5 uzayabilir.';
  }
  if (q.includes('wo-2026-001') || q.includes('türbin')) {
    return 'WO-2026-001 (Türbin Kanatçık Seti) en yüksek önceliğe (Priority 3) sahiptir ve 15.0 saatte tamamlanarak teslim tarihine (24.0 Sa) yetişmektedir.';
  }
  return 'MND EdgePlan-AI Hibrit Optimizasyon Motoru aktif. Gantt şeması, tezgah yük dağılımları ve arıza senaryoları hakkında sorularınızı sorabilirsiniz.';
}
