package com.edgeplan.service;

import com.edgeplan.dto.OptimizationRequest;
import com.edgeplan.model.Resource;
import com.edgeplan.model.WorkOrder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class IntentParserService {

    private final DataInitializationService dataService;

    public OptimizationRequest parseInstruction(String instructionText, OptimizationRequest existingRequest) {
        if (existingRequest == null) {
            existingRequest = new OptimizationRequest();
        }
        if (instructionText == null || instructionText.trim().isEmpty()) {
            return existingRequest;
        }

        String textLower = instructionText.toLowerCase();

        // 1. Order Priority / Urgency Intent
        Map<String, WorkOrder> orders = dataService.getWorkOrders();
        for (String orderId : orders.keySet()) {
            if (textLower.contains(orderId.toLowerCase()) && (textLower.contains("acil") || textLower.contains("öncelik") || textLower.contains("urgent"))) {
                log.info("Detected URGENT intent for order: {}", orderId);
                existingRequest.getPriorityOverrides().put(orderId, 3);
            }
        }

        // 2. Machine Maintenance / Breakdown Intent
        Map<String, Resource> resources = dataService.getResources();
        for (String resId : resources.keySet()) {
            Resource res = resources.get(resId);
            if ((textLower.contains(resId.toLowerCase()) || textLower.contains(res.getName().toLowerCase())) &&
                (textLower.contains("bakım") || textLower.contains("arıza") || textLower.contains("devre dışı") || textLower.contains("durdu"))) {
                log.info("Detected MAINTENANCE / DISABLE intent for resource: {}", resId);
                if (!existingRequest.getDisabledResourceIds().contains(resId)) {
                    existingRequest.getDisabledResourceIds().add(resId);
                }
            }
        }

        // 3. Objective Selection Intent
        if (textLower.contains("gecikme") || textLower.contains("tardiness")) {
            existingRequest.setObjectiveType("TARDINESS");
        } else if (textLower.contains("dengeli") || textLower.contains("balanc")) {
            existingRequest.setObjectiveType("BALANCED");
        } else if (textLower.contains("makespan") || textLower.contains("süre")) {
            existingRequest.setObjectiveType("MAKESPAN");
        }

        return existingRequest;
    }
}
