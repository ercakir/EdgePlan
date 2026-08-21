package com.edgeplan.service;

import com.edgeplan.model.Resource;
import com.edgeplan.model.ScheduleResult;
import com.edgeplan.model.ScheduledTask;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfReportService {

    public byte[] generatePdfReportBytes(ScheduleResult schedule, List<Resource> resources) {
        log.info("Generating direct PDF document binary stream for schedule...");

        double makespan = schedule != null && schedule.getMetrics() != null ? schedule.getMetrics().getMakespanHours() : 38.0;
        int tardy = schedule != null && schedule.getMetrics() != null ? schedule.getMetrics().getTardyOrderCount() : 0;
        double util = schedule != null && schedule.getMetrics() != null ? schedule.getMetrics().getTotalMachineUtilizationPct() : 30.5;
        List<ScheduledTask> tasks = schedule != null ? schedule.getTasks() : List.of();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        String nowStr = LocalDateTime.now().format(dtf);

        // Construct PostScript / PDF 1.4 Raw Document Binary Stream
        StringBuilder sb = new StringBuilder();
        sb.append("%PDF-1.4\n");
        sb.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
        sb.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
        sb.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n");
        sb.append("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");
        sb.append("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

        // Page Contents Stream
        StringBuilder stream = new StringBuilder();

        // Title Header Banner Box
        stream.append("0.05 0.1 0.2 rg\n"); // Dark Navy background
        stream.append("30 750 535 60 re f\n");

        stream.append("BT\n");
        stream.append("/F1 18 Tf 1 1 1 rg 45 785 Td (MND EDGEPLAN-AI REBORN) Tj\n");
        stream.append("/F2 10 Tf 0.4 0.8 1 rg 0 -18 Td (FABRIKA URETIM CIZELGELENDIRME VE KAPASITE RAPORU) Tj\n");

        // Metadata Text
        stream.append("/F2 9 Tf 0.2 0.2 0.2 rg 0 -35 Td (Rapor Tarihi: ").append(nowStr).append("  |  Hazirlayan: MND AI Optimization Engine) Tj\n");

        // KPI Summary Box
        stream.append("0.95 0.97 1 rg 30 635 535 60 re f\n");
        stream.append("0.2 0.4 0.8 RG 1 w 30 635 535 60 re s\n");

        stream.append("/F1 11 Tf 0.1 0.2 0.4 rg 45 670 Td (KPI OZETI:) Tj\n");
        stream.append("/F2 10 Tf 0.2 0.2 0.2 rg 0 -18 Td (Makespan: ").append(makespan).append(" Sa  |  Geciken Siparis: ").append(tardy).append(" Adet  |  Ortalama Doluluk: %").append(util).append(") Tj\n");

        // Machine Utilization Table Header
        stream.append("/F1 12 Tf 0.05 0.1 0.2 rg 45 600 Td (1. TEKIL MAKINE DOLULUK ORANLARI (%)) Tj\n");
        stream.append("0.8 0.8 0.8 RG 45 590 m 535 590 l s\n");

        int yPos = 570;
        stream.append("/F2 9 Tf 0.2 0.2 0.2 rg\n");
        for (Resource res : resources) {
            long taskCount = tasks.stream().filter(t -> t.getResourceId().equals(res.getResourceId())).count();
            double hours = Math.round(tasks.stream().filter(t -> t.getResourceId().equals(res.getResourceId())).mapToDouble(t -> t.getEndHour() - t.getStartHour()).sum() * 10.0) / 10.0;
            double resUtil = Math.min(100.0, Math.round((hours / 38.0) * 100 * 10.0) / 10.0);

            stream.append("45 ").append(yPos).append(" Td (").append(res.getName()).append(": ").append(hours).append(" Sa / 38 Sa - Doluluk: %").append(resUtil).append(" - ").append(taskCount).append(" Operasyon) Tj\n");
            yPos -= 16;
            if (yPos < 450) break;
        }

        // Operation Sequence Table Header
        stream.append("/F1 12 Tf 0.05 0.1 0.2 rg 45 ").append(yPos - 20).append(" Td (2. ATANMIS OPERASYON CIZELGESI (ILK 8 OPERASYON)) Tj\n");
        yPos -= 30;

        int count = 0;
        stream.append("/F2 8 Tf 0.3 0.3 0.3 rg\n");
        for (ScheduledTask t : tasks) {
            stream.append("45 ").append(yPos).append(" Td ([").append(t.getOrderId()).append("] ").append(t.getOperationName()).append(" -> ").append(t.getResourceName()).append(" | Baslangic: ").append(t.getStartHour()).append(" Sa - Bitis: ").append(t.getEndHour()).append(" Sa) Tj\n");
            yPos -= 14;
            count++;
            if (count >= 8 || yPos < 100) break;
        }

        // Footer Note
        stream.append("/F2 8 Tf 0.5 0.5 0.5 rg 45 40 Td (Bu rapor MND EdgePlan-AI tarafindan uretilmistir. Tum haklari saklidir.) Tj\n");
        stream.append("ET\n");

        byte[] streamBytes = stream.toString().getBytes(StandardCharsets.ISO_8859_1);

        sb.append("6 0 obj\n<< /Length ").append(streamBytes.length).append(" >>\nstream\n");
        sb.append(stream.toString());
        sb.append("\nendstream\nendobj\n");

        // Cross Reference Table
        String body = sb.toString();
        int xrefOffset = body.length();

        sb.append("xref\n0 7\n");
        sb.append("0000000000 65535 f \n");
        sb.append("0000000009 00000 n \n");
        sb.append("0000000058 00000 n \n");
        sb.append("0000000115 00000 n \n");
        sb.append("0000000244 00000 n \n");
        sb.append("0000000325 00000 n \n");
        sb.append("0000000401 00000 n \n");
        sb.append("trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n").append(xrefOffset).append("\n%%EOF\n");

        return sb.toString().getBytes(StandardCharsets.ISO_8859_1);
    }
}
