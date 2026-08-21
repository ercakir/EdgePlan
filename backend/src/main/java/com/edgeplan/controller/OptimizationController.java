package com.edgeplan.controller;

import com.edgeplan.dto.ChatRequest;
import com.edgeplan.dto.DeltaCalculationResult;
import com.edgeplan.dto.OptimizationRequest;
import com.edgeplan.model.Resource;
import com.edgeplan.model.ScheduleResult;
import com.edgeplan.model.WorkOrder;
import com.edgeplan.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@RequiredArgsConstructor
public class OptimizationController {

    private final DataInitializationService dataService;
    private final OptimizationSolverService solverService;
    private final DeltaCalculatorService deltaService;
    private final IntentParserService intentParserService;
    private final AiAdvisorService aiAdvisorService;
    private final HybridIntentEngineService hybridIntentEngineService;
    private final PdfReportService pdfReportService;

    private ScheduleResult baselineSchedule;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("service", "MND EdgePlan-AI Reborn Optimization Engine");
        status.put("version", "1.0.0-SNAPSHOT");
        status.put("resourceCount", dataService.getResources().size());
        status.put("orderCount", dataService.getWorkOrders().size());
        status.put("operationCount", dataService.getWorkOrders().values().stream().mapToInt(o -> o.getOperationIds().size()).sum());
        return ResponseEntity.ok(status);
    }

    @GetMapping("/resources")
    public ResponseEntity<Collection<Resource>> getResources() {
        return ResponseEntity.ok(dataService.getResources().values());
    }

    @GetMapping("/orders")
    public ResponseEntity<Collection<WorkOrder>> getOrders() {
        return ResponseEntity.ok(dataService.getWorkOrders().values());
    }

    @GetMapping("/baseline")
    public ResponseEntity<ScheduleResult> getBaselineSchedule() {
        if (baselineSchedule == null) {
            baselineSchedule = solverService.solve(new OptimizationRequest(), true);
        }
        return ResponseEntity.ok(baselineSchedule);
    }

    @PostMapping("/optimize")
    public ResponseEntity<ScheduleResult> optimize(
            @RequestParam(required = false) String instructionText,
            @RequestBody(required = false) OptimizationRequest request
    ) {
        if (request == null) {
            request = new OptimizationRequest();
        }

        if (instructionText != null && !instructionText.trim().isEmpty()) {
            request = intentParserService.parseInstruction(instructionText, request);
        }

        log.info("Executing optimization run. Objective: {}, Disabled resources: {}, Priority Overrides: {}",
                request.getObjectiveType(), request.getDisabledResourceIds(), request.getPriorityOverrides());

        if (baselineSchedule == null) {
            baselineSchedule = solverService.solve(new OptimizationRequest(), true);
        }

        ScheduleResult customSchedule = solverService.solve(request, false);
        DeltaCalculationResult deltas = deltaService.calculateDeltas(baselineSchedule, customSchedule, dataService.getResources());
        customSchedule.setDeltas(deltas);

        return ResponseEntity.ok(customSchedule);
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> processChat(@RequestBody(required = false) ChatRequest payload) {
        String query = payload != null && payload.getQuery() != null ? payload.getQuery() : "";
        log.info("Received AI Agent Chat query: {}", query);
        Map<String, Object> result = aiAdvisorService.processChatQuery(query, new OptimizationRequest());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/report/pdf")
    public ResponseEntity<byte[]> downloadPdfReport() {
        if (baselineSchedule == null) {
            baselineSchedule = solverService.solve(new OptimizationRequest(), true);
        }
        byte[] pdfBytes = pdfReportService.generatePdfReportBytes(baselineSchedule, new ArrayList<>(dataService.getResources().values()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("MND_Uretim_Cizelgesi_Raporu_2026.pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
