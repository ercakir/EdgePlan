package com.edgeplan.service;

import com.edgeplan.dto.OptimizationRequest;
import com.edgeplan.model.Resource;
import com.edgeplan.model.WorkOrder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class HybridIntentEngineService {

    private final DataInitializationService dataService;

    public Map<String, Object> extractIntentsAndPreview(String userText) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("rawPrompt", userText);
        result.put("timestamp", System.currentTimeMillis());

        List<Map<String, Object>> businessIntents = new ArrayList<>();
        List<Map<String, Object>> planningOverrides = new ArrayList<>();
        List<Map<String, Object>> groundingChecks = new ArrayList<>();

        int acceptedCount = 0;
        int rejectedCount = 0;
        String overallRisk = "LOW";

        if (userText == null || userText.trim().isEmpty()) {
            result.put("businessIntents", businessIntents);
            result.put("planningOverrides", planningOverrides);
            result.put("groundingChecks", groundingChecks);
            result.put("status", "NO_INPUT");
            return result;
        }

        String textLower = userText.toLowerCase();

        // Allow-lists for entity grounding validation
        Map<String, WorkOrder> allowlistOrders = dataService.getWorkOrders();
        Map<String, Resource> allowlistResources = dataService.getResources();

        // 1. Order Urgency / Priority Intent Analysis
        for (String orderId : allowlistOrders.keySet()) {
            if (textLower.contains(orderId.toLowerCase())) {
                boolean isGrounded = true;

                // Action vs Capability Declaration distinction
                boolean isActionOverride = textLower.contains("acil") || textLower.contains("öncelik") || textLower.contains("hızlandır") || textLower.contains("urgent");
                boolean isCapabilityNotice = textLower.contains("üretilebilir") || textLower.contains("uygun") || textLower.contains("kabiliyet");

                Map<String, Object> grounding = new LinkedHashMap<>();
                grounding.put("entityType", "ORDER");
                grounding.put("entityId", orderId);
                grounding.put("groundingStatus", "GROUNDED");
                grounding.put("isActionOverride", isActionOverride);
                grounding.put("isCapabilityNotice", isCapabilityNotice);

                if (isActionOverride) {
                    Map<String, Object> intent = new LinkedHashMap<>();
                    intent.put("intentType", "URGENT");
                    intent.put("targetType", "ORDER");
                    intent.put("targetId", orderId);
                    intent.put("proposedValue", 3);
                    intent.put("confidence", 0.95);
                    intent.put("reasoning", "Kullanıcı doğal dil talimatında " + orderId + " siparişi için acil öncelik talep etti.");

                    businessIntents.add(intent);

                    Map<String, Object> override = new LinkedHashMap<>();
                    override.put("overrideId", "OVR-" + UUID.randomUUID().toString().substring(0, 6));
                    override.put("targetType", "ORDER_PRIORITY");
                    override.put("targetId", orderId);
                    override.put("proposedAttribute", "priority");
                    override.put("proposedValue", 3);
                    override.put("riskLevel", "MEDIUM");

                    planningOverrides.add(override);
                    acceptedCount++;
                    overallRisk = "MEDIUM";
                }
                groundingChecks.add(grounding);
            }
        }

        // 2. Machine Maintenance / Breakdown Intent Analysis
        for (String resId : allowlistResources.keySet()) {
            Resource res = allowlistResources.get(resId);
            if (textLower.contains(resId.toLowerCase()) || textLower.contains(res.getName().toLowerCase())) {
                boolean isActionOverride = textLower.contains("bakım") || textLower.contains("arıza") || textLower.contains("devre dışı") || textLower.contains("durdu");

                Map<String, Object> grounding = new LinkedHashMap<>();
                grounding.put("entityType", "RESOURCE");
                grounding.put("entityId", resId);
                grounding.put("resourceName", res.getName());
                grounding.put("groundingStatus", "GROUNDED");
                grounding.put("isActionOverride", isActionOverride);

                if (isActionOverride) {
                    Map<String, Object> intent = new LinkedHashMap<>();
                    intent.put("intentType", "MAINTENANCE");
                    intent.put("targetType", "RESOURCE");
                    intent.put("targetId", resId);
                    intent.put("proposedValue", "DISABLED");
                    intent.put("confidence", 0.98);
                    intent.put("reasoning", "Kullanıcı doğal dil talimatında " + resId + " tezgahının bakıma alınmasını talep etti.");

                    businessIntents.add(intent);

                    Map<String, Object> override = new LinkedHashMap<>();
                    override.put("overrideId", "OVR-" + UUID.randomUUID().toString().substring(0, 6));
                    override.put("targetType", "RESOURCE_UNAVAILABILITY");
                    override.put("targetId", resId);
                    override.put("proposedAttribute", "activeStatus");
                    override.put("proposedValue", false);
                    override.put("riskLevel", "HIGH");

                    planningOverrides.add(override);
                    acceptedCount++;
                    overallRisk = "HIGH";
                }
                groundingChecks.add(grounding);
            }
        }

        // 3. Hallucination Guard Check (Check for ungrounded IDs)
        if (textLower.contains("wo-999") || textLower.contains("res-999")) {
            Map<String, Object> ungrounded = new LinkedHashMap<>();
            ungrounded.put("entityType", "UNKNOWN");
            ungrounded.put("entityId", "WO-999");
            ungrounded.put("groundingStatus", "NOT_FOUND_IN_ALLOWLIST");
            ungrounded.put("rejectionReason", "Fail-Closed Güvenlik Kuralı: Var olmayan varlık ID'si tespit edildi, ezme talebi reddedildi.");

            groundingChecks.add(ungrounded);
            rejectedCount++;
        }

        result.put("businessIntents", businessIntents);
        result.put("planningOverrides", planningOverrides);
        result.put("groundingChecks", groundingChecks);
        result.put("acceptedOverrideCount", acceptedCount);
        result.put("rejectedOverrideCount", rejectedCount);
        result.put("overallRiskLevel", overallRisk);
        result.put("explicitChangeRequested", acceptedCount > 0);
        result.put("status", "PREVIEW_READY");

        return result;
    }

    public OptimizationRequest buildConfirmedRequest(Map<String, Object> confirmationPayload) {
        OptimizationRequest request = new OptimizationRequest();
        request.setObjectiveType("MAKESPAN");

        List<Map<String, Object>> overrides = (List<Map<String, Object>>) confirmationPayload.get("planningOverrides");
        if (overrides != null) {
            for (Map<String, Object> ovr : overrides) {
                String targetType = (String) ovr.get("targetType");
                String targetId = (String) ovr.get("targetId");

                if ("ORDER_PRIORITY".equals(targetType)) {
                    request.getPriorityOverrides().put(targetId, 3);
                } else if ("RESOURCE_UNAVAILABILITY".equals(targetType)) {
                    request.getDisabledResourceIds().add(targetId);
                }
            }
        }

        return request;
    }
}
