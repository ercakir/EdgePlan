package com.edgeplan.service;

import com.edgeplan.model.MaintenanceWindow;
import com.edgeplan.model.Operation;
import com.edgeplan.model.Resource;
import com.edgeplan.model.WorkOrder;
import lombok.Getter;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;

@Service
@Getter
public class DataInitializationService {

    private final Map<String, Resource> resources = new LinkedHashMap<>();
    private final Map<String, WorkOrder> workOrders = new LinkedHashMap<>();
    private final Map<String, Operation> operations = new LinkedHashMap<>();
    private final List<MaintenanceWindow> maintenanceWindows = new ArrayList<>();

    @PostConstruct
    public void initData() {
        // 1. Resources (Machines)
        addResource("RES_CNC_01", "5-Eksen CNC İşleme Merkezi", 1.0, 1.1, 150.0);
        addResource("RES_CNC_02", "3-Eksen CNC Freze", 1.0, 0.95, 120.0);
        addResource("RES_LATHE_01", "Hassas Torna Tezgahı", 1.0, 1.0, 100.0);
        addResource("RES_ASY_01", "Otomatik Montaj Hattı", 1.0, 1.2, 80.0);
        addResource("RES_QC_01", "CMM Kalite Kontrol İstasyonu", 1.0, 1.0, 90.0);
        addResource("RES_PACK_01", "Paketleme & Sevkiyat Ünitesi", 1.0, 1.3, 60.0);

        // 2. Work Orders & Operations
        // Order 1: WO-2026-001 (Urgent Turboprop Component)
        createWorkOrder("WO-2026-001", "Türbin Kanatçık Seti", 3, 24.0, List.of(
                createOp("OP_101", "WO-2026-001", 1, "Kaba Talaş Kaldırma", 4.0, List.of("RES_CNC_01", "RES_CNC_02"), 0.5),
                createOp("OP_102", "WO-2026-001", 2, "Hassas Yüzey İşleme", 6.0, List.of("RES_CNC_01"), 0.5),
                createOp("OP_103", "WO-2026-001", 3, "Kalite Kontrol Ölçümü", 2.0, List.of("RES_QC_01"), 0.2),
                createOp("OP_104", "WO-2026-001", 4, "Son Montaj & Muhafaza", 3.0, List.of("RES_ASY_01"), 0.3)
        ));

        // Order 2: WO-2026-002 (High Priority Hydraulics)
        createWorkOrder("WO-2026-002", "Hidrolik Silindir Gövdesi", 2, 36.0, List.of(
                createOp("OP_201", "WO-2026-002", 1, "Torna Çap Tornalama", 5.0, List.of("RES_LATHE_01"), 0.4),
                createOp("OP_202", "WO-2026-002", 2, "Delik Delme & Borlama", 4.0, List.of("RES_CNC_02", "RES_CNC_01"), 0.3),
                createOp("OP_203", "WO-2026-002", 3, "Basınç Sızdırmazlık Testi", 3.0, List.of("RES_QC_01"), 0.2),
                createOp("OP_204", "WO-2026-002", 4, "Koruyucu Paketleme", 2.0, List.of("RES_PACK_01"), 0.1)
        ));

        // Order 3: WO-2026-003 (Normal Priority Gearbox)
        createWorkOrder("WO-2026-003", "Endüstriyel Şanzıman Kutusu", 1, 48.0, List.of(
                createOp("OP_301", "WO-2026-003", 1, "Döküm Gövde Taşlama", 6.0, List.of("RES_CNC_02"), 0.5),
                createOp("OP_302", "WO-2026-003", 2, "Dişli Açma İşlemi", 8.0, List.of("RES_CNC_01", "RES_LATHE_01"), 0.8),
                createOp("OP_303", "WO-2026-003", 3, "Rulman Montajı", 4.0, List.of("RES_ASY_01"), 0.4),
                createOp("OP_304", "WO-2026-003", 4, "Final Ürün Kalite Testi", 2.5, List.of("RES_QC_01"), 0.2),
                createOp("OP_305", "WO-2026-003", 5, "Ahşap Sandıklama", 2.0, List.of("RES_PACK_01"), 0.1)
        ));

        // Order 4: WO-2026-004 (High Priority Actuator)
        createWorkOrder("WO-2026-004", "Elektromekanik Aktüatör", 2, 30.0, List.of(
                createOp("OP_401", "WO-2026-004", 1, "Mil Tornalama", 3.5, List.of("RES_LATHE_01"), 0.3),
                createOp("OP_402", "WO-2026-004", 2, "Konnektör Yuvası Açma", 3.0, List.of("RES_CNC_02"), 0.3),
                createOp("OP_403", "WO-2026-004", 3, "Kablolama & Kart Montajı", 5.0, List.of("RES_ASY_01"), 0.5),
                createOp("OP_404", "WO-2026-004", 4, "Fonksiyonel Test", 2.0, List.of("RES_QC_01"), 0.2)
        ));

        // 3. Maintenance Windows
        maintenanceWindows.add(MaintenanceWindow.builder()
                .maintenanceId("MAIN_001")
                .resourceId("RES_CNC_01")
                .startHour(12.0)
                .endHour(14.0)
                .description("Periyodik Yağ Değişimi & Kalibrasyon")
                .build());

        maintenanceWindows.add(MaintenanceWindow.builder()
                .maintenanceId("MAIN_002")
                .resourceId("RES_ASY_01")
                .startHour(20.0)
                .endHour(22.0)
                .description("Bant Konveyör Bakımı")
                .build());
    }

    private void addResource(String id, String name, double capacity, double efficiency, double cost) {
        resources.put(id, Resource.builder()
                .resourceId(id)
                .name(name)
                .capacity(capacity)
                .efficiencyFactor(efficiency)
                .costPerHour(cost)
                .active(true)
                .build());
    }

    private Operation createOp(String id, String orderId, int seq, String name, double duration, List<String> eligibleRes, double setup) {
        Operation op = Operation.builder()
                .operationId(id)
                .orderId(orderId)
                .sequenceIndex(seq)
                .name(name)
                .durationHours(duration)
                .eligibleResourceIds(eligibleRes)
                .setupTimeHours(setup)
                .build();
        operations.put(id, op);
        return op;
    }

    private void createWorkOrder(String id, String productFamily, int priority, double dueDate, List<Operation> ops) {
        List<String> opIds = new ArrayList<>();
        for (Operation op : ops) {
            opIds.add(op.getOperationId());
        }
        workOrders.put(id, WorkOrder.builder()
                .orderId(id)
                .productFamily(productFamily)
                .priority(priority)
                .dueDateHour(dueDate)
                .operationIds(opIds)
                .build());
    }
}
